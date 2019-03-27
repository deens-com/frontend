import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import history from 'main/history';
import apiClient from 'libs/apiClient';
import arrayMove from 'array-move';
import { getHeroImageUrlFromMedia } from 'libs/media';
import { saveTrip } from 'libs/localStorage';
import Itinerary from './Itinerary';
import { getFromCoordinates } from 'libs/Utils';
import Header from './Header';
import Footer from './Footer';
import { mapServicesByDay, mapDaysToServices } from '../Trip/mapServicesToDays';
import Options from './Options';
import I18nText from 'shared_components/I18nText';
import {addServiceRequest} from 'libs/trips'

function addLang(text) {
  return {
    'en-us': text,
  };
}

function createStateBasedOnTrip(props) {
  const heroImage = getHeroImageUrlFromMedia(props.trip && props.trip.media);
  return {
    services: mapServicesByDay(props.trip.services),
    tripData: {
      duration: props.trip.duration,
      startDate: props.trip.startDate || props.startDate,
      title: props.trip.title['en-us'],
      description: props.trip.description ? props.trip.description['en-us'] : '',
      location: props.trip.location,
      adultCount: props.trip.adultCount || props.adults || 1,
      childrenCount: props.trip.childrenCount || props.children || 0,
      infantCount: props.trip.infantCount || props.infants || 0,
      basePrice: props.trip.basePrice || 0,
      userStartLocation: props.trip.userStartLocation || null,
      userEndLocation: props.trip.userEndLocation || null,
    },
    image: heroImage || null,
    // UI
    draggingDay: false,
    showingMap: false,
    showingTransports: true,
    // transportation methods
    fromService: {},
    toService: {},
    // this booleans are numbers so we can make many requests.
    // probably it would be better to have timestamps to avoid race conditions
    isSaving: 0,
    isCheckingAvailability: 0,
    isLoadingTransportation: 0,
    // this is for allowing to undo
    lastRemovedService: null,
  };
}

function formatMedia(url) {
  return [
    {
      type: 'image',
      hero: true,
      names: {
        'en-us': 'Trip image',
      },
      files: {
        original: {
          url,
        },
        hero: {
          url,
        },
      },
    },
  ];
}

function makeTransportationState(transportation) {
  return {
    toService: transportation.reduce(
      (prevObj, transport) => transport.toServiceOrgId ? ({ ...prevObj, [transport.toServiceOrgId]: transport }) : prevObj,
      {},
    ),
    fromService: transportation.reduce(
      (prevObj, transport) => transport.fromServiceOrgId ? ({ ...prevObj, [transport.fromServiceOrgId]: transport }) : prevObj,
      {},
    ),
  };
}

function addAvailabilityData(services, availability) {
  const availabilityById = availability.reduce(
    (prevObj, service) => ({
      ...prevObj,
      [service.serviceOrganizationId]: service,
    }),
    {},
  );

  return mapServicesByDay(
    mapDaysToServices(services).map(service => ({
      ...service,
      availability: availabilityById[service._id],
    })),
  );
}

export const TripContext = React.createContext();

export default class TripOrganizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = createStateBasedOnTrip(props);
  }

  propTypes = {
    trip: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
    tripId: PropTypes.string,
  };

  componentDidMount() {
    this.checkAvailability();
    this.getTransportation();
  }

  // GENERAL ACTIONS

  addIsSaving = () => {
    this.setState(prevState => ({
      isSaving: prevState.isSaving++,
    }));
  };

  removeIsSaving = () => {
    this.setState(prevState => ({
      isSaving: prevState.isSaving--,
    }));
  };

  addIsLoadingTransports = () => {
    this.setState(prevState => ({
      isLoadingTransportation: prevState.isLoadingTransportation + 1,
    }));
  };

  removeIsLoadingTransports = transportation => {
    this.setState(prevState => ({
      isLoadingTransportation: prevState.isLoadingTransportation - 1,
      ...(transportation && makeTransportationState(transportation)),
    }));
  };

  saveTrip = async dataToSave => {
    this.addIsSaving();

    await apiClient.trips.patch(this.props.trip._id, dataToSave);

    this.removeIsSaving();
  };

  saveRearrangeServices = async () => {
    this.addIsSaving();
    this.addIsLoadingTransports();
    this.startCheckingAvailability();

    const dataToSave = this.parseServicesForSaving();

    await apiClient.trips.serviceOrganizations.rearrange.post(this.props.trip._id, dataToSave);

    this.removeIsSaving();
    this.checkAvailability();
    this.getTransportation();
    this.removeIsLoadingTransports();
  };

  saveRemovedServices = async (serviceOrgIds = []) => {
    if (serviceOrgIds.length === 0) {
      return;
    }
    this.addIsSaving();

    await apiClient.trips.serviceOrganizations.delete(this.props.trip._id, serviceOrgIds);

    this.removeIsSaving();
    this.getTransportation();
  };

  saveAvailabilityCode = async (serviceOrgId, availabilityCode) => {
    this.addIsSaving();

    const services = (await apiClient.trips.serviceOrganizations.availabilityCode.post(this.props.trip._id, [
      { serviceOrgId, availabilityCode },
    ])).data

    this.removeIsSaving();

    return services;
  };

  getTransportation = async () => {
    this.addIsLoadingTransports();

    const transportation = (await apiClient.trips.calculateDistances.post(this.props.trip._id)).data

    this.removeIsLoadingTransports(transportation);
  };

  setTransportation = async body => {
    this.addIsLoadingTransports();

    await apiClient.trips.transports.post(this.props.trip._id, body)

    await this.getTransportation();

    this.removeIsLoadingTransports();
  };

  localSave = () =>
    saveTrip({
      ...this.state.tripData,
      title: addLang(this.state.tripData.title),
      description: addLang(this.state.tripData.description),
      media: formatMedia(this.state.image),
      services: mapDaysToServices(this.state.services),
    });

  book = () => {
    history.push(`/trips/checkout/${this.props.tripId}`)
  };
  share = () => {};

  requestAvailability = async () => {
    const { startDate, adultCount, infantCount, childrenCount } = this.state.tripData;
    const bookingDate = moment(startDate).format('YYYY-MM-DD');
    const peopleCount = adultCount + infantCount + childrenCount;
    const data = { bookingDate, adultCount, childrenCount, infantCount, peopleCount };

    return apiClient.trips.availability.get(this.props.trip._id, data);
  };

  startCheckingAvailability = () => {
    // this is for set the checking state before we save the trip
    this.setState({
      isCheckingAvailability: 1,
    });
  };

  checkAvailability = async () => {
    const checkingTime = new Date().valueOf();

    this.setState({
      isCheckingAvailability: checkingTime,
    });

    const response = await this.requestAvailability();

    this.setState(prevState => {
      if (checkingTime === prevState.isCheckingAvailability) {
        return {
          isCheckingAvailability: 0,
          services: addAvailabilityData(prevState.services, response.data),
        };
      }
      return {};
    });
  };

  // SINGLE ACTIONS

  goToAddService = (day, type = 'accommodation') => {
    const { history, trip } = this.props;
    const coord =
      trip.location &&
      trip.location.geo &&
      trip.location.geo.coordinates &&
      getFromCoordinates(trip.location.geo.coordinates);
    const country =
      trip.location && trip.location.country && I18nText.translate(trip.location.country.names);
    const address =
      trip.location &&
      `${trip.location.city || trip.location.state}${country ? `, ${country}` : ''}`;

    this.props.updatePath(
      {
        type: [type],
        latitude: coord && coord.lat,
        longitude: coord && coord.lng,
        address,
      },
      history,
      {
        tripId: trip._id,
        day,
        duration: this.state.tripData.duration,
        startDate: this.state.tripData.startDate.valueOf(),
        isCreatingTripNotLoggedIn: !Boolean(trip._id),
      },
    );
  };

  changeDayPosition = (currentDay, nextDay) => {
    this.setState(
      prevState => {
        const diff = nextDay - currentDay;
        return {
          services: mapServicesByDay(
            mapDaysToServices(prevState.services).map(service => {
              if (service.day === currentDay) {
                return {
                  ...service,
                  day: nextDay,
                };
              }
              if (diff > 0) {
                if (service.day > currentDay && service.day <= nextDay) {
                  return {
                    ...service,
                    day: service.day - 1,
                  };
                }
              } else {
                if (service.day < currentDay && service.day >= nextDay) {
                  return {
                    ...service,
                    day: service.day + 1,
                  };
                }
              }
              return service;
            }),
          ),
        };
      },
      () => {
        this.saveRearrangeServices();
      },
    );
  };

  changeServicePosition = (currentDay, currentPosition, nextDay, nextPosition) => {
    const saveTrip = this.saveRearrangeServices;

    if (currentDay === nextDay) {
      this.setState(prevState => {
        return {
          services: {
            ...prevState.services,
            [currentDay]: arrayMove(prevState.services[currentDay], currentPosition, nextPosition),
          },
        };
      }, saveTrip);
      return;
    }

    this.setState(prevState => {
      const previousDay = prevState.services[currentDay].filter(
        (_, index) => index !== currentPosition,
      );
      const newDay = prevState.services[nextDay] || [];
      return {
        services: {
          ...prevState.services,
          [currentDay]: previousDay,
          [nextDay]: [
            ...newDay.slice(0, nextPosition),
            {
              ...prevState.services[currentDay][currentPosition],
              day: Number(nextDay),
            },
            ...newDay.slice(nextPosition),
          ],
        },
      };
    }, saveTrip);
  };

  removeDay = day => {
    const removedServices = [];
    this.setState(
      prevState => {
        const duration = prevState.tripData.duration - 60 * 24;
        const services = mapServicesByDay(
          mapDaysToServices(prevState.services)
            .filter(service => {
              if (service.day === day) {
                removedServices.push(service._id);
              }
              return service.day !== day;
            })
            .map(service => {
              if (service.day > day) {
                return {
                  ...service,
                  day: service.day - 1,
                };
              }
              return service;
            }),
        );

        return {
          services,
          tripData: {
            ...prevState.tripData,
            duration,
          },
        };
      },
      async () => {
        await this.saveRemovedServices(removedServices);
        this.saveTrip({
          duration: this.state.tripData.duration,
        });
        this.saveRearrangeServices();
      },
    );
  };

  addService = async (serviceToAdd, day) => {
    // THIS ONLY WORKS FOR RECENTLY CREATED SERVICES (CUSTOM SERVICES!)
    // WE USE SERVICE ID INSTEAD OF SERVICE ORG ID TO IDENTIFY THE SERVICE
    const trip = (await addServiceRequest(this.props.tripId, day, serviceToAdd._id)).data
    this.setState(prevState => ({
      services: {
        ...prevState.services,
        [day]: [
          ...prevState.services[day],
          {
            ...trip.services.find(service => service.service === serviceToAdd._id),
            service: serviceToAdd,
          }
        ]
      },
    }))
    this.getTransportation();
  }

  removeService = serviceOrgId => {
    let removedService;
    this.setState(prevState => {
      const services = mapServicesByDay(
        mapDaysToServices(prevState.services)
          .filter((service, i) => {
            if (service._id === serviceOrgId) {
              removedService = { service, position: i };
              return false
            }
            return true;
          })
      );
      return {
        services,
        lastRemovedService: removedService
      }
    }, () => {
      this.waitAndRemoveService(removedService.service._id)
    })
  }

  waitAndRemoveService = id => {
    setTimeout(() => {
      this.setState(prevState => {
        if (!prevState.lastRemovedService) {
          return
        }
        if (prevState.lastRemovedService.service._id !== id) {
          return
        }
        return {
          lastRemovedService: null
        }
      }, async () => {
        await this.saveRemovedServices([id]);
      })
    }, 5000)
  }

  undoRemoveService = () => {
    this.setState(prevState => {
      const services = mapDaysToServices(prevState.services)
      return {
        lastRemovedService: null,
        services: mapServicesByDay(
          [
            ...services.slice(0, prevState.lastRemovedService.position),
            prevState.lastRemovedService.service,
            ...services.slice(prevState.lastRemovedService.position),
          ]
        )
      }
    })
  }

  addNewDay = afterDay => {
    this.setState(
      prevState => {
        const duration = prevState.tripData.duration + 60 * 24;
        let services;

        if (afterDay) {
          services = mapServicesByDay(
            mapDaysToServices(prevState.services).map(service => {
              if (service.day > afterDay) {
                return {
                  ...service,
                  day: service.day + 1,
                };
              }
              return service;
            }),
          );
        }

        return {
          services,
          tripData: {
            ...prevState.tripData,
            duration,
          },
        };
      },
      () => {
        this.saveRearrangeServices();
        this.saveTrip({
          duration: this.state.tripData.duration,
        });
      },
    );
  };

  parseServicesForSaving = () => {
    return mapDaysToServices(this.state.services).map(service => ({
      ...service,
      service: service.service._id,
      serviceOrgId: service._id,
    }));
  };

  uploadImage = async file => {
    const uploadedFile = await apiClient.media.post(file);

    const url = uploadedFile.data.url;
    this.setState(
      {
        image: url,
      },
      () => {
        this.saveTrip({
          media: formatMedia(url),
        });
      },
    );
  };

  editTitle = title => {
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          title,
        },
      }),
      () => {
        this.saveTrip({ title: addLang(title) });
        this.props.changeCurrentUserTrip({ _id: this.props.tripId, title: addLang(title) })
      },
    );
  };

  editDescription = description => {
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          description,
        },
      }),
      () => {
        this.saveTrip({ description: addLang(description) });
      },
    );
  };

  changeServiceTitle = (serviceId, day, title) => {
    this.modifyService(serviceId, day, { title: addLang(title) })
  }

  changeServicePrice = (serviceId, day, price) => {
    if (!Number(price)) {
      return
    }

    this.modifyService(serviceId, day, { basePrice: Number(price) })
  }

  changeServiceDays = async (service, startDay, endDay) => {
    const instances = mapDaysToServices(this.state.services).filter(s => s.service._id === service.service._id)
    let groups = []
    let currentGroupIndex = -1
    let currentDay = instances[0].day - 1
    let currentServiceGroupIndex = -1
    const groupsAffected = new Set([])

    for (let instance of instances) {
      if (currentDay !== instance.day) {
        currentDay = instance.day
        currentGroupIndex++
      }

      if (!groups[currentGroupIndex]) {
        groups.push([])
      }

      if (instance._id === service._id) {
        currentServiceGroupIndex = currentGroupIndex
        groupsAffected.add(currentGroupIndex)
      }

      if (instance.day >= startDay && instance.day <= endDay) {
        groupsAffected.add(currentGroupIndex)
      }

      groups[currentGroupIndex].push(instance)
      currentDay++
    }

    let serviceDays = new Set([])

    groups.forEach((group, index) => {
      if (!groupsAffected.has(index)) {
        group.forEach(service => {
          serviceDays.add(service.day)
        })
      }
    })

    for (let i = startDay; i <= endDay; i++) {
      serviceDays.add(i)
    }

    const trip = (await apiClient.trips.serviceOrganizations.post(this.props.tripId, { days: [...serviceDays], serviceId: service.service._id })).data;
    const newServices = {}
    for (let day in this.state.services) {
      newServices[day] = this.state.services[day]
      if (!serviceDays.has(Number(day))) {
        newServices[day] = this.state.services[day].filter(s => s.service._id !== service.service._id)
      }
      if (serviceDays.has(Number(day)) && !this.state.services[day].find(s => s.service._id === service.service._id)) {
        newServices[day].push({
          ...trip.services.find(s => s.day === Number(day) && s.service === service.service._id),
          day: Number(day),
          service: service.service,
        })
      }
    }
    this.setState({
      services: newServices,
    })
  }

  modifyService = (serviceId, day, data) => {
    this.setState(prevState => {
      const services = prevState.services[day].map(service => {
        if (service.service._id === serviceId) {
          return {
            ...service,
            service: {
              ...service.service,
              ...data,
            }
          }
        }
        return service
      })

      return {
        services: {
          ...prevState.services,
          [day]: services,
        },
      }
    })

    apiClient.services.patch(serviceId, data)
  }

  changeGuests = async data => {
    const newData = {
      adultCount: data.adults,
      childrenCount: data.children,
      infantCount: data.infants,
    };
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          ...newData,
        },
      }),
      async () => {
        this.startCheckingAvailability();
        await this.saveTrip(newData);
        await this.checkAvailability();
      },
    );
  };

  onChangeDate = async date => {
    const newData = { startDate: date.toJSON() };

    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          ...newData,
        },
      }),
      async () => {
        this.startCheckingAvailability();
        await this.saveTrip(newData);
        await this.checkAvailability();
      },
    );
  };

  selectOption = (service, option) => {
    this.setState(
      prevState => {
        return {
          services: {
            ...prevState.services,
            [service.day]: prevState.services[service.day].map(
              currentService =>
                service._id !== currentService._id
                  ? currentService
                  : {
                      ...currentService,
                      selectedOption: option,
                    },
            ),
          },
        };
      },
      async () => {
        const servicesWithSelectedOptions = (await this.saveAvailabilityCode(
          service._id,
          option.otherAttributes.availabilityCode.code,
        )).services.filter(service => Boolean(service.selectedOption));

        this.setState(prevState => ({
          services: mapServicesByDay(
            mapDaysToServices(prevState.services).map(serv => {
              if (serv.service._id !== service.service._id) {
                return serv;
              }
              const selected = servicesWithSelectedOptions.find(
                withOption => withOption._id === serv._id,
              );
              return {
                ...serv,
                selectedOption: selected && selected.selectedOption,
              };
            }),
          ),
        }));
      },
    );
  };

  changeInitialLocation = location => {
    this.changeLocation(location, 'userStartLocation');
  };

  changeFinalLocation = location => {
    this.changeLocation(location, 'userEndLocation');
  };

  changeLocation = (location, key) => {
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          [key]: location,
        },
      }),
      async () => {
        await this.saveTrip({
          [key]: location,
        });
        await this.getTransportation();
      },
    );
  };

  changeShowTransport = value => {
    this.setState({
      showingTransports: value,
    });
  };

  changeShowMap = value => {
    this.setState({
      showingMap: value,
    });
  };

  selectTransport = async (transport, fromServiceId, toServiceId, position = 'middle') => {
    const requestBody = {
      position,
      fromServiceOrganizationId: fromServiceId,
      toServiceOrganizationId: toServiceId,
      transportMode: transport,
    };

    await this.setTransportation(requestBody);
  };

  // RENDER

  render() {
    const {
      draggingDay,
      tripData,
      services,
      image,
      isLoadingTransportation,
      showingTransports,
      isCheckingAvailability,
      lastRemovedService,
    } = this.state;

    return (
      <TripContext.Provider
        value={{
          tripData: tripData,
          servicesByDay: services,
          isLoadingTransportation: Boolean(isLoadingTransportation),
          isCheckingAvailability: Boolean(isCheckingAvailability),
          showingTransports,
          changeInitialLocation: this.changeInitialLocation,
          changeFinalLocation: this.changeFinalLocation,
          removeService: this.removeService,
          addService: this.addService,
          changeServiceTitle: this.changeServiceTitle,
          changeServicePrice: this.changeServicePrice,
          changeServiceDays: this.changeServiceDays,
        }}
      >
        <Header
          onEditTitle={this.editTitle}
          onEditDescription={this.editDescription}
          title={tripData.title}
          description={tripData.description}
          image={image}
          onImageUpload={this.uploadImage}
        />
        <Options
          onChangeDate={this.onChangeDate}
          onChangeGuests={this.changeGuests}
          adults={tripData.adultCount}
          children={tripData.childrenCount}
          infants={tripData.infantCount}
          startDate={tripData.startDate}
          changeShowTransport={this.changeShowTransport}
          changeShowMap={this.changeShowMap}
        />
        <Itinerary
          addNewDay={this.addNewDay}
          summaryView={draggingDay}
          tripStartDate={tripData.startDate}
          services={services}
          duration={tripData.duration}
          changeServicePosition={this.changeServicePosition}
          changeDayPosition={this.changeDayPosition}
          goToAddService={this.goToAddService}
          removeDay={this.removeDay}
          selectOption={this.selectOption}
          selectTransport={this.selectTransport}
          fromService={this.state.fromService}
          toService={this.state.toService}
          showingMap={this.state.showingMap}
        />
        <Footer
          price={tripData.basePrice.toFixed(2)}
          book={this.book}
          share={this.share}
          isSaving={Boolean(this.state.isSaving)}
          isCheckingAvailability={Boolean(isCheckingAvailability)}
          recentlyDeletedService={lastRemovedService}
          undoRemoveService={this.undoRemoveService}
        />
      </TripContext.Provider>
    );
  }
}
