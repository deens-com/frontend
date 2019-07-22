import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import history from 'main/history';
import apiClient from 'libs/apiClient';
import Itinerary from './Itinerary';
import { getFromCoordinates, minutesToDays, daysToMinutes } from 'libs/Utils';
import Header from './Header';
import Footer from './Footer';
import { mapServicesByDay, mapDaysToServices } from '../Trip/mapServicesToDays';
import Options from './Options';
import WarningLogin from './WarningLogin';
import I18nText from 'shared_components/I18nText';
import { addServiceRequest, formatMedia } from 'libs/trips';
import analytics from 'libs/analytics';
import withTouchHandler from 'shared_components/withTouchHandler';
import urls from 'libs/urlGenerator';
import { signAndUploadImage } from 'libs/trips';

function addLang(text) {
  return {
    en: text,
  };
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

export const TripContext = React.createContext();

class TripOrganizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: 0,
      showingTransports: false,
      showingMap: false,
    };
  }
  static propTypes = {
    trip: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
    tripId: PropTypes.string,
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.checkAvailability();
    this.props.getTransportation();
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

  addIsLoadingPrice = () => {
    this.setState(prevState => ({
      isLoadingPrice: prevState.isLoadingPrice + 1,
    }));
  };

  removeIsLoadingPrice = () => {
    this.setState(prevState => ({
      isLoadingPrice: prevState.isLoadingPrice - 1,
    }));
  };

  saveTrip = async dataToSave => {
    this.addIsSaving();
    this.addIsLoadingPrice();

    const trip = (await apiClient.trips.patch(this.props.tripId, dataToSave)).data;

    this.removeIsLoadingPrice();
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
      this.props.tripId,
      dataToSave,
    )).data;

    this.removeIsSaving();
    if (!dontCheck) {
      this.removeIsLoadingPrice();
      this.props.checkAvailability();
    }
    this.props.getTransportation();
    this.removeIsLoadingTransports();
  };

  prefetchSearchResults = async onlyLastDay => {
    // TO DO
    return;
    const startLocation = getFromCoordinates(
      this.props.trip.userStartLocation && this.props.trip.userStartLocation.geo.coordinates,
    );
    const days = minutesToDays(this.props.trip.duration);

    const dates = Array.from({ length: days }).map((_, i) =>
      moment(this.props.trip.startDate)
        .add(i, 'days')
        .format('YYYY-MM-DD'),
    );
    const common = {
      adultCount: this.props.trip.adultCount,
      childrenCount: this.props.trip.childrenCount,
      infantCount: this.props.trip.infantCount,
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

  book = () => {
    analytics.trip.book();
    history.push(urls.trip.checkout(this.props.tripId));
  };

  share = () => {
    history.push(urls.trip.share(this.props.tripId));
  };

  requestAvailability = async () => {
    const { startDate, adultCount, infantCount, childrenCount } = this.props.trip;
    const bookingDate = moment(startDate).format('YYYY-MM-DD');
    const peopleCount = adultCount + infantCount + childrenCount;
    const data = { bookingDate, adultCount, childrenCount, infantCount, peopleCount };

    return apiClient.trips.availability.get(this.props.tripId, data);
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
        countryCode: location.countryCode,
        locationSearchType: 'latlng',
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
        tripId: this.props.tripId,
        day,
        duration: this.state.tripData.duration,
        startDate: this.state.tripData.startDate.valueOf(),
      },
    );
  };

  changeDayPosition = (currentDay, nextDay) => {
    // IF WE USE THIS FUNCTION AGAIN REMEMBER TO HANDLE `daysData`
    return;
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

  changeServicePosition = (id, currentDay, idAfter, nextDay) => {
    this.props.temporalRearrange(id, currentDay, idAfter, nextDay);
  };

  changeTripDuration = daysDuration => {
    const currentDuration = minutesToDays(this.props.trip.duration);
    let diff = currentDuration - daysDuration;
    if (diff < 0) {
      this.props.editTrip({
        duration: daysDuration * 60 * 24,
      });
      return;
    }
    while (diff > 0) {
      this.removeDay(daysDuration + diff, false);
      diff--;
    }
  };

  changeStartDate = async date => {
    await this.props.editTrip({
      startDate: date.toJSON(),
    });
    this.props.checkAvailability();
  };

  removeDay = async day => {
    this.props.removeDay(day);
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
    this.props.getTransportation();
  };

  removeService = serviceOrgId => {
    this.props.removeService(serviceOrgId);
  };

  addNewDay = () => {
    this.props.editTrip({ duration: this.props.trip.duration + 60 * 24 });
  };

  parseServicesForSaving = () => {
    return mapDaysToServices(this.state.services).map(service => ({
      ...service,
      service: service.service._id,
      serviceOrgId: service._id,
    }));
  };

  uploadImage = async file => {
    try {
      const url = await signAndUploadImage(file);
      this.props.editTrip({
        media: formatMedia(url),
      });
    } catch (e) {
      this.setState({
        imageError: e.message,
      });
    }
  };

  editTitle = async title => {
    this.props.editTrip({ title });
  };

  editDescription = description => {
    this.props.editTrip({ description });
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
    const instances = Object.values(this.props.inDayServices)
      .filter(s => s.service === service.service._id)
      .sort((a, b) => a.day - b.day);
    let groups = [];
    let currentGroupIndex = -1;
    let currentDay = instances[0].day - 1;
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

    await this.props.moveServices({
      days: [...serviceDays],
      serviceId: service.service._id,
    });

    this.props.getTransportation();
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
    await this.props.editTrip(newData);
    await this.props.checkAvailability();
  };

  selectOption = (service, option) => {
    this.addIsLoadingPrice();
    this.props.selectOption(service, option);
    this.removeIsLoadingPrice();
  };

  changeInitialLocation = location => {
    this.changeLocation(location, 'userStartLocation');
    if (!this.props.trip.userEndLocation) {
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
    this.props.editTrip({
      [key]: location,
    });
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
    this.props.editTrip({
      notes: {
        ...this.props.trip.notes,
        [day]: note,
      },
    });
  };

  // RENDER

  render() {
    const {
      trip,
      services: servicesProps,
      inDayServices,
      transports,
      isLoadingTransportation,
      lastRemovedService,
      isCheckingAvailability,
    } = this.props;
    const { draggingDay, services, image, showingTransports, headerHeight } = this.state;

    return (
      <TripContext.Provider
        value={{
          tripId: this.props.tripId,
          tripData: trip,
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
          availabilities: this.props.availabilities,
        }}
      >
        <Header
          onEditTitle={this.editTitle}
          onEditDescription={this.editDescription}
          title={trip.title}
          description={trip.description}
          image={image}
          onImageUpload={this.uploadImage}
          onHeightChanged={this.onHeaderHeightChanged}
        />
        {!this.props.session.username && <WarningLogin />}
        <Options
          onChangeGuests={this.changeGuests}
          adults={trip.adultCount}
          children={trip.childrenCount}
          infants={trip.infantCount}
          startDate={trip.startDate}
          duration={trip.duration}
          changeShowTransport={this.changeShowTransport}
          changeShowMap={this.changeShowMap}
          tripParents={this.props.trip.parents}
        />
        <Itinerary
          addNewDay={this.addNewDay}
          summaryView={draggingDay}
          services={servicesProps}
          trip={trip}
          inDayServices={inDayServices}
          changeServicePosition={this.changeServicePosition}
          changeDayPosition={this.changeDayPosition}
          goToAddService={this.goToAddService}
          removeDay={this.removeDay}
          selectOption={this.selectOption}
          selectTransport={this.props.selectTransport}
          showingMap={this.state.showingMap}
          saveDayNote={this.changeDayNote}
          transports={transports}
          selectedOptions={this.props.selectedOptions}
          onServiceDrop={this.props.saveTemporalRearrangement}
        />
        <Footer
          price={trip.totalPrice.toFixed(2)}
          isLoadingPrice={Boolean(this.state.isLoadingPrice)}
          book={this.book}
          share={this.share}
          isSaving={Boolean(this.state.isSaving)}
          isCheckingAvailability={Boolean(isCheckingAvailability)}
          recentlyDeletedService={
            lastRemovedService.length
              ? {
                  ...inDayServices[lastRemovedService[lastRemovedService.length - 1].id],
                  service:
                    servicesProps[
                      inDayServices[lastRemovedService[lastRemovedService.length - 1].id].service
                    ],
                }
              : null
          }
          undoRemoveService={this.props.undoRemoveService}
        />
      </TripContext.Provider>
    );
  }
}

export default withTouchHandler(TripOrganizer);
