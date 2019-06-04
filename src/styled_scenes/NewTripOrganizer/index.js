import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import history from 'main/history';
import apiClient from 'libs/apiClient';
import arrayMove from 'array-move';
import { getHeroImageUrlFromMedia } from 'libs/media';
import Itinerary from './Itinerary';
import { getFromCoordinates, minutesToDays, daysToMinutes } from 'libs/Utils';
import Header from './Header';
import Footer from './Footer';
import { mapServicesByDay, mapDaysToServices } from '../Trip/mapServicesToDays';
import Options from './Options';
import WarningLogin from './WarningLogin';
import I18nText from 'shared_components/I18nText';
import { addServiceRequest } from 'libs/trips';
import analytics from 'libs/analytics';
import withTouchHandler from 'shared_components/withTouchHandler';

function addLang(text) {
  return {
    'en-us': text,
  };
}

function generateDaysData(trip) {
  const days = minutesToDays(trip.duration);
  let daysData = {};
  for (let i = 1; i <= days; i++) {
    daysData[i] = {
      notes: trip.notes ? trip.notes[i] : undefined,
    };
  }
  return daysData;
}

function removeDayAndGenerateData(data, dayToRemove) {
  let newData = {};
  Object.keys(data).forEach(key => {
    if (key < dayToRemove) {
      newData[key] = data[key];
      return;
    }
    if (key === dayToRemove) {
      return;
    }
    if (key > dayToRemove) {
      newData[key - 1] = data[key];
      return;
    }
  });
  return newData;
}

function addDayAndGenerateData(data, addAfter) {
  if (!addAfter) {
    return data;
  }
  let newData = {};
  Object.keys(data).forEach(key => {
    if (key < addAfter) {
      newData[key] = data[key];
      return;
    }
    if (key === addAfter) {
      newData[key] = data[key];
      newData[key + 1] = {};
      return;
    }
    if (key > addAfter) {
      newData[key + 1] = data[key];
      return;
    }
  });
  return newData;
}

function parseDaysDataToSave(data) {
  let notes = {};
  Object.keys(data).forEach(key => {
    if (data[key].notes) {
      notes[key] = data[key].notes;
    }
  });
  return {
    notes,
  };
}

function createStateBasedOnTrip(props) {
  const heroImage = getHeroImageUrlFromMedia(props.trip && props.trip.media);
  return {
    services: mapServicesByDay(props.trip.services),
    tripData: {
      duration: props.trip.duration,
      startDate: props.startDate,
      title: props.trip.title['en-us'],
      description: props.trip.description ? props.trip.description['en-us'] : '',
      location: props.trip.location,
      adultCount: props.trip.adultCount || props.adults || 2,
      childrenCount: props.trip.childrenCount || props.children || 0,
      infantCount: props.trip.infantCount || props.infants || 0,
      totalPrice: props.trip.totalPrice || 0,
      userStartLocation: props.trip.userStartLocation || null,
      userEndLocation: props.trip.userEndLocation || null,
    },
    daysData: generateDaysData(props.trip),
    image: heroImage || null,
    // UI
    draggingDay: false,
    showingMap: false,
    showingTransports: false,
    headerHeight: 0,
    // transportation methods
    fromService: {},
    toService: {},
    // this booleans are numbers so we can make many requests.
    // probably it would be better to have timestamps to avoid race conditions
    isSaving: 0,
    isCheckingAvailability: 0,
    isLoadingTransportation: 0,
    isLoadingPrice: 0,
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
      (prevObj, transport) =>
        transport.toServiceOrgId ? { ...prevObj, [transport.toServiceOrgId]: transport } : prevObj,
      {},
    ),
    fromService: transportation.reduce(
      (prevObj, transport) =>
        transport.fromServiceOrgId
          ? { ...prevObj, [transport.fromServiceOrgId]: transport }
          : prevObj,
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

class TripOrganizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = createStateBasedOnTrip(props);
  }

  static propTypes = {
    trip: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
    tripId: PropTypes.string,
  };

  componentDidMount() {
    this._isMounted = true;
    if (!(this.props.trip.startDate !== this.state.tripData.startDate) || !this.props.adultCount) {
      this.saveTrip({
        adultCount: this.state.tripData.adultCount,
        childrenCount: this.state.tripData.childrenCount,
        infantCount: this.state.tripData.infantCount,
        startDate: this.state.tripData.startDate,
      });
    }
    this.checkAvailability();
    this.getTransportation();
    this.prefetchSearchResults();
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  addIsLoadingPrice = () => {
    this.setState(prevState => ({
      isLoadingPrice: prevState.isLoadingPrice + 1,
    }));
  };

  removeIsLoadingPrice = totalPrice => {
    this.setState(prevState => ({
      tripData: {
        ...prevState.tripData,
        totalPrice,
      },
      isLoadingPrice: prevState.isLoadingPrice - 1,
    }));
  };

  saveTrip = async dataToSave => {
    this.addIsSaving();
    this.addIsLoadingPrice();

    const trip = (await apiClient.trips.patch(this.props.trip._id, dataToSave)).data;

    this.removeIsLoadingPrice(trip.totalPrice);
    this.removeIsSaving();
  };

  saveRearrangeServices = async dontCheck => {
    this.addIsSaving();
    this.addIsLoadingTransports();
    if (!dontCheck) {
      this.startCheckingAvailability();
      this.addIsLoadingPrice();
    }

    const dataToSave = this.parseServicesForSaving();

    const trip = (await apiClient.trips.serviceOrganizations.rearrange.post(
      this.props.trip._id,
      dataToSave,
    )).data;

    this.removeIsSaving();
    if (!dontCheck) {
      this.removeIsLoadingPrice(trip.totalPrice);
      this.checkAvailability();
    }
    this.getTransportation();
    this.removeIsLoadingTransports();
  };

  saveDaysData = async () => {
    this.addIsSaving();
    const dataToSave = parseDaysDataToSave(this.state.daysData);

    await apiClient.trips.patch(this.props.trip._id, dataToSave);

    this.removeIsSaving();
  };

  saveRemovedServices = async (serviceOrgIds = []) => {
    if (serviceOrgIds.length === 0) {
      return;
    }
    this.addIsSaving();
    this.addIsLoadingPrice();

    const trip = (await apiClient.trips.serviceOrganizations.delete(
      this.props.trip._id,
      serviceOrgIds,
    )).data;

    this.removeIsLoadingPrice(trip.totalPrice);
    this.removeIsSaving();
    this.getTransportation();
  };

  saveAvailabilityCode = async (serviceOrgId, availabilityCode) => {
    this.addIsSaving();
    this.addIsLoadingPrice();

    const trip = (await apiClient.trips.serviceOrganizations.availabilityCode.post(
      this.props.trip._id,
      [{ serviceOrgId, availabilityCode }],
    )).data;

    this.removeIsLoadingPrice(trip.totalPrice);
    this.removeIsSaving();

    return trip;
  };

  prefetchSearchResults = async onlyLastDay => {
    const startLocation = getFromCoordinates(
      this.state.tripData.userStartLocation &&
        this.state.tripData.userStartLocation.geo.coordinates,
    );
    const days = minutesToDays(this.state.tripData.duration);

    const dates = Array.from({ length: days }).map((_, i) =>
      moment(this.state.tripData.startDate)
        .add(i, 'days')
        .format('YYYY-MM-DD'),
    );
    const common = {
      adultCount: this.state.tripData.adultCount,
      childrenCount: this.state.tripData.childrenCount,
      infantCount: this.state.tripData.infantCount,
      dates,
      location: startLocation
        ? {
            lat: startLocation.lat,
            lng: startLocation.lng,
          }
        : null,
    };

    let alreadySentWithCommonLocation = false; // avoid sending more than once the same request
    for (let day = onlyLastDay ? days : 1; day <= days; day++) {
      const useCustomLocation = this.state.services[day] && this.state.services[day].length > 0;
      const location = useCustomLocation
        ? getFromCoordinates(
            this.state.services[day][this.state.services[day].length - 1].service.location.geo
              .coordinates,
          )
        : common.location;

      const body = {
        ...common,
        location: location
          ? {
              lat: location.lat,
              lng: location.lng,
            }
          : null,
      };

      if (body.location) {
        if (useCustomLocation) {
          apiClient.services.search.prefetch(body);
        } else {
          if (!alreadySentWithCommonLocation) {
            alreadySentWithCommonLocation = true;
            apiClient.services.search.prefetch(body);
          }
        }
      }
    }
  };

  getTransportation = async () => {
    this.addIsLoadingTransports();

    const transportation = (await apiClient.trips.calculateDistances.post(this.props.trip._id))
      .data;

    this.removeIsLoadingTransports(transportation);
  };

  setTransportation = async body => {
    this.addIsLoadingTransports();

    await apiClient.trips.transports.post(this.props.trip._id, body);

    await this.getTransportation();

    this.removeIsLoadingTransports();
  };

  book = () => {
    analytics.trip.book();
    history.push(`/trips/checkout/${this.props.tripId}`);
  };

  share = () => {
    history.push(`/trips/share/${this.props.tripId}`);
  };

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
    const { trip } = this.props;
    const { services, tripData } = this.state;

    let location;
    if (services[day]) {
      location = services[day][services[day].length - 1].service.location;
    } else {
      location = tripData.userStartLocation;
    }

    const coord = location && location.geo && getFromCoordinates(location.geo.coordinates);
    const country = location && location.country && I18nText.translate(location.country.names);
    const address =
      location && `${location.city || location.state}${country ? `, ${country}` : ''}`;

    this.props.updateSearchParams(
      {
        type,
        lat: coord && coord.lat,
        lng: coord && coord.lng,
        adults: tripData.adultCount,
        children: tripData.childrenCount,
        infants: tripData.infantCount,
        address,
        startDate: moment(tripData.startDate)
          .add(day - 1, 'days')
          .valueOf(),
        endDate:
          type === 'accommodation'
            ? moment(tripData.startDate)
                .add(day, 'days')
                .valueOf()
            : undefined,
      },
      {
        tripId: trip._id,
        day,
        duration: this.state.tripData.duration,
        startDate: this.state.tripData.startDate.valueOf(),
      },
    );
  };

  changeDayPosition = (currentDay, nextDay) => {
    // IF WE USE THIS FUNCTION AGAIN REMEMBER TO HANDLE `daysData`
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
    const saveTrip = () => {
      this.saveRearrangeServices(currentDay === nextDay);
    };

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

  changeTripDuration = daysDuration => {
    const currentDuration = minutesToDays(this.state.tripData.duration);
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          duration: daysToMinutes(daysDuration),
        },
      }),
      () => {
        let diff = currentDuration - daysDuration;
        while (diff > 0) {
          this.removeDay(daysDuration + diff, false);
          diff--;
        }
        if (currentDuration < daysDuration) {
          this.prefetchSearchResults(true);
        }
        this.saveTrip({
          duration: this.state.tripData.duration,
        });
      },
    );
  };

  changeStartDate = date => {
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          startDate: date.toJSON(),
        },
      }),
      () => {
        this.prefetchSearchResults();
        this.saveTrip({
          startDate: this.state.tripData.startDate,
        });
        this.checkAvailability();
      },
    );
  };

  removeDay = (day, changeDuration = true) => {
    const removedServices = [];
    this.setState(
      prevState => {
        const duration = changeDuration
          ? prevState.tripData.duration - 60 * 24
          : prevState.tripData.duration;
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
            duration: duration >= 1 ? duration : 60 * 24,
          },
          daysData: removeDayAndGenerateData(prevState.daysData, day),
        };
      },
      async () => {
        await this.saveRemovedServices(removedServices);
        this.saveTrip({
          duration: this.state.tripData.duration,
        });
        this.prefetchSearchResults();
        this.saveDaysData();
        this.saveRearrangeServices();
      },
    );
  };

  addService = async (serviceToAdd, day) => {
    // THIS ONLY WORKS FOR RECENTLY CREATED SERVICES (CUSTOM SERVICES!)
    // WE USE SERVICE ID INSTEAD OF SERVICE ORG ID TO IDENTIFY THE SERVICE
    const trip = (await addServiceRequest(this.props.tripId, day, serviceToAdd._id)).data;
    this.setState(prevState => ({
      services: {
        ...prevState.services,
        [day]: [
          ...(prevState.services[day] || []),
          {
            ...trip.services.find(service => service.service === serviceToAdd._id),
            service: serviceToAdd,
          },
        ],
      },
    }));
    this.getTransportation();
  };

  removeService = serviceOrgId => {
    let removedService;
    this.setState(
      prevState => {
        const services = mapServicesByDay(
          mapDaysToServices(prevState.services).filter((service, i) => {
            if (service._id === serviceOrgId) {
              removedService = { service, position: i };
              return false;
            }
            return true;
          }),
        );
        return {
          services,
          lastRemovedService: removedService,
        };
      },
      () => {
        this.prefetchSearchResults();
        this.waitAndRemoveService(removedService.service._id);
      },
    );
  };

  waitAndRemoveService = id => {
    setTimeout(async () => {
      if (!this._isMounted) {
        // this is not the best solution but it's quick and works properly
        await this.saveRemovedServices([id]);
        return;
      }
      this.setState(
        prevState => {
          if (!prevState.lastRemovedService) {
            return;
          }
          if (prevState.lastRemovedService.service._id !== id) {
            return;
          }
          return {
            lastRemovedService: null,
          };
        },
        async () => {
          await this.saveRemovedServices([id]);
        },
      );
    }, 5000);
  };

  undoRemoveService = () => {
    this.setState(prevState => {
      const services = mapDaysToServices(prevState.services);
      return {
        lastRemovedService: null,
        services: mapServicesByDay([
          ...services.slice(0, prevState.lastRemovedService.position),
          prevState.lastRemovedService.service,
          ...services.slice(prevState.lastRemovedService.position),
        ]),
      };
    });
  };

  addNewDay = afterDay => {
    this.setState(
      prevState => {
        const duration = prevState.tripData.duration + 60 * 24;
        let services = prevState.services;

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
          daysData: addDayAndGenerateData(prevState.daysData, afterDay),
        };
      },
      () => {
        if (afterDay) {
          this.saveRearrangeServices();
          this.saveDaysData();
        }
        this.saveTrip({
          duration: this.state.tripData.duration,
        });
        this.prefetchSearchResults(true);
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
        this.props.changeCurrentUserTrip({ _id: this.props.tripId, title: addLang(title) });
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
    this.modifyService(serviceId, day, { title: addLang(title) });
  };

  changeServicePrice = (serviceId, day, price) => {
    if (!Number(price)) {
      return;
    }

    this.modifyService(serviceId, day, { basePrice: Number(price) });
  };

  changeServiceDays = async (service, startDay, endDay) => {
    const instances = mapDaysToServices(this.state.services).filter(
      s => s.service._id === service.service._id,
    );
    let groups = [];
    let currentGroupIndex = -1;
    let currentDay = instances[0].day - 1;
    let currentServiceGroupIndex = -1;
    const groupsAffected = new Set([]);

    for (let instance of instances) {
      if (currentDay !== instance.day) {
        currentDay = instance.day;
        currentGroupIndex++;
      }

      if (!groups[currentGroupIndex]) {
        groups.push([]);
      }

      if (instance._id === service._id) {
        currentServiceGroupIndex = currentGroupIndex;
        groupsAffected.add(currentGroupIndex);
      }

      if (instance.day >= startDay && instance.day <= endDay) {
        groupsAffected.add(currentGroupIndex);
      }

      groups[currentGroupIndex].push(instance);
      currentDay++;
    }

    let serviceDays = new Set([]);

    groups.forEach((group, index) => {
      if (!groupsAffected.has(index)) {
        group.forEach(service => {
          serviceDays.add(service.day);
        });
      }
    });

    for (let i = startDay; i <= endDay; i++) {
      serviceDays.add(i);
    }

    const trip = (await apiClient.trips.serviceOrganizations.post(this.props.tripId, {
      days: [...serviceDays],
      serviceId: service.service._id,
    })).data;
    const newServices = {};
    const numberOfDays = minutesToDays(this.state.tripData.duration);

    for (let day = 1; day <= numberOfDays; day++) {
      const servicesOfCurrentDay = this.state.services[day] || [];
      newServices[day] = servicesOfCurrentDay;
      if (!serviceDays.has(Number(day))) {
        newServices[day] = servicesOfCurrentDay.filter(s => s.service._id !== service.service._id);
      }
      if (
        serviceDays.has(Number(day)) &&
        !servicesOfCurrentDay.find(s => s.service._id === service.service._id)
      ) {
        newServices[day].push({
          ...trip.services.find(s => s.day === Number(day) && s.service === service.service._id),
          day: Number(day),
          service: service.service,
        });
      }
    }
    this.setState({
      services: newServices,
    });
  };

  modifyService = (serviceId, day, data) => {
    this.setState(prevState => {
      const services = prevState.services[day].map(service => {
        if (service.service._id === serviceId) {
          return {
            ...service,
            service: {
              ...service.service,
              ...data,
            },
          };
        }
        return service;
      });

      return {
        services: {
          ...prevState.services,
          [day]: services,
        },
      };
    });

    apiClient.services.patch(serviceId, data);
  };

  changeGuests = async data => {
    const newData = {
      adultCount: data.adults,
      childrenCount: data.children,
      infantCount: data.infants,
    };
    this.saveTrip(newData);
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          ...newData,
        },
      }),
      async () => {
        this.prefetchSearchResults();
        this.startCheckingAvailability();
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
    if (!this.state.tripData.userEndLocation) {
      this.changeLocation(location, 'userEndLocation', true);
    }
  };

  changeFinalLocation = location => {
    this.changeLocation(location, 'userEndLocation');
  };

  onHeaderHeightChanged = headerHeight => {
    this.setState({
      headerHeight,
    });
  };

  changeLocation = (location, key, dontSave = false) => {
    this.setState(
      prevState => ({
        tripData: {
          ...prevState.tripData,
          [key]: location,
        },
      }),
      async () => {
        if (dontSave) {
          return;
        }
        if (key === 'userStartLocation') {
          this.prefetchSearchResults();
        }
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

  changeDayNote = (text, day) => {
    const note = addLang(text);
    this.setState(
      prevState => ({
        daysData: {
          ...prevState.daysData,
          [day]: {
            ...prevState.daysData[day],
            notes: note,
          },
        },
      }),
      () => {
        this.saveDaysData();
      },
    );
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
      headerHeight,
    } = this.state;

    return (
      <TripContext.Provider
        value={{
          tripId: this.props.tripId,
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
          changeTripDuration: this.changeTripDuration,
          changeStartDate: this.changeStartDate,
          session: this.props.session,
          headerHeight,
        }}
      >
        <Header
          onEditTitle={this.editTitle}
          onEditDescription={this.editDescription}
          title={tripData.title}
          description={tripData.description}
          image={image}
          onImageUpload={this.uploadImage}
          onHeightChanged={this.onHeaderHeightChanged}
        />
        {!this.props.session.username && <WarningLogin />}
        <Options
          onChangeGuests={this.changeGuests}
          adults={tripData.adultCount}
          children={tripData.childrenCount}
          infants={tripData.infantCount}
          startDate={tripData.startDate}
          duration={tripData.duration}
          changeShowTransport={this.changeShowTransport}
          changeShowMap={this.changeShowMap}
          tripParents={this.props.trip.parents}
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
          saveDayNote={this.changeDayNote}
          daysData={this.state.daysData}
        />
        <Footer
          price={tripData.totalPrice.toFixed(2)}
          isLoadingPrice={Boolean(this.state.isLoadingPrice)}
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

export default withTouchHandler(TripOrganizer);
