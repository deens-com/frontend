import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import history from 'main/history';
import apiClient from 'libs/apiClient';
import Itinerary from './Itinerary';
import { getFromCoordinates, minutesToDays } from 'libs/Utils';
import Header from './Header';
import Footer from './Footer';
import { mapServicesByDay, mapDaysToServices } from '../Trip/mapServicesToDays';
import Options from './Options';
import WarningLogin from './WarningLogin';
import I18nText from 'shared_components/I18nText';
import { formatMedia } from 'libs/trips';
import analytics from 'libs/analytics';
import { error } from 'libs/colors';
import withTouchHandler from 'shared_components/withTouchHandler';
import urls from 'libs/urlGenerator';
import { signAndUploadImage } from 'libs/trips';
import { Trans } from '@lingui/macro';
import AddCustomServiceModal from './Itinerary/Day/AddCustomServiceModal';
import fetchHelpers from 'libs/fetch_helpers';
import { Modal } from 'semantic-ui-react';

function addLang(text) {
  return {
    en: text,
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
      isEditingService: null,
    };
  }
  static propTypes = {
    trip: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
    tripId: PropTypes.string,
  };

  componentDidMount() {
    if (
      !this.props.trip.adultCount ||
      !this.props.trip.childrenCount ||
      !this.props.trip.infantCount
    ) {
      this.props.editTrip({
        adultCount: this.props.adults,
        childrenCount: this.props.children,
        infantCount: this.props.infants,
      });
    }
    this.prefetchSearchResults();
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
    const servicesByDay = mapServicesByDay(this.props.trip.services);
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
      adultCount: this.props.adults,
      childrenCount: this.props.children,
      infantCount: this.props.infants,
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
      const useCustomLocation = servicesByDay[day] && servicesByDay[day].length > 0;
      const location = useCustomLocation
        ? getFromCoordinates(
            servicesByDay[day][servicesByDay[day].length - 1].service.location.geo.coordinates,
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
    const { adults, children, infants } = this.props;
    const { startDate } = this.props.trip;
    const bookingDate = moment(startDate).format('YYYY-MM-DD');
    const peopleCount = adults + infants + children;
    const data = {
      bookingDate,
      adultCount: adults,
      childrenCount: children,
      infantCount: infants,
      peopleCount,
    };

    return apiClient.trips.availability.get(this.props.tripId, data);
  };
  // SINGLE ACTIONS

  goToSettings = day => {
    history.push(urls.trip.settings(this.props.tripId), {
      day,
    });
  };

  goToAddService = (day, type = 'accommodation') => {
    const { inDayServices } = this.props;
    let location;
    const servicesInCurrentDay = Object.values(inDayServices).filter(s => s.day === day);
    if (servicesInCurrentDay.length > 0) {
      location = this.props.services[servicesInCurrentDay[servicesInCurrentDay.length - 1].service]
        .location;
    } else {
      location = this.props.trip.userStartLocation;
    }

    const coord = location && location.geo && getFromCoordinates(location.geo.coordinates);
    const country = location && location.country && I18nText.translate(location.country.names);
    const address =
      location &&
      (location.address || `${location.city || location.state}${country ? `, ${country}` : ''}`);

    this.props.updateSearchParams(
      {
        type,
        countryCode: location && location.countryCode,
        locationSearchType: 'latlng',
        lat: coord && coord.lat,
        lng: coord && coord.lng,
        adults: this.props.adults,
        children: this.props.children,
        infants: this.props.infants,
        address,
        startDate: moment(this.props.startDate)
          .add(day - 1, 'days')
          .valueOf(),
        endDate:
          type === 'accommodation'
            ? moment(this.props.startDate)
                .add(day, 'days')
                .valueOf()
            : undefined,
      },
      {
        newState: {
          tripId: this.props.tripId,
          day,
          duration: this.props.trip.duration,
          startDate: this.props.startDate,
        },
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
    if (currentDuration < daysDuration) {
      this.prefetchSearchResults(true);
    }
  };

  changeStartDate = async date => {
    await this.props.editTrip({
      startDate: date && date.toJSON(),
    });
    this.prefetchSearchResults();
    this.props.checkAvailability();
  };

  removeDay = async day => {
    await this.props.removeDay(day);
    this.prefetchSearchResults();
  };

  addService = async (serviceToAdd, day) => {
    await this.props.addCustomService(serviceToAdd, day);
    this.props.getTransportation();
  };

  removeService = async serviceOrgId => {
    await this.props.removeService(serviceOrgId);
    this.prefetchSearchResults();
  };

  openEditService = async serviceId => {
    this.setState({
      isEditingService: serviceId,
    });
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

  changeServiceDaysWithoutDate = async (service, startDay, endDay) => {
    let serviceDays = new Set([]);

    for (let i = startDay; i <= endDay; i++) {
      serviceDays.add(i);
    }

    await this.props.moveServices({
      days: [...serviceDays],
      serviceId: service.service._id,
    });

    this.props.checkAvailability();
    this.props.getTransportation();
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

    this.props.checkAvailability();
    this.props.getTransportation();
  };

  modifyService = (serviceId, data) => {
    this.props.modifyCustomService(serviceId, data);
  };

  changeGuests = async data => {
    const newData = {
      adultCount: data.adults,
      childrenCount: data.children,
      infantCount: data.infants,
    };
    await this.props.editTrip(newData);
    this.prefetchSearchResults();
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
    if (key === 'userStartLocation') {
      this.prefetchSearchResults();
    }
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

  moveServiceAndSave = (id, currentDay, idAfter, nextDay, moveTo) => {
    this.props.temporalRearrange(id, currentDay, idAfter, nextDay, moveTo);
    this.props.saveTemporalRearrangement();
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
          openEditService: this.openEditService,
          addService: this.addService,
          changeServiceTitle: this.changeServiceTitle,
          changeServicePrice: this.changeServicePrice,
          changeServiceDays: this.changeServiceDays,
          changeServiceDaysWithoutDate: this.changeServiceDaysWithoutDate,
          changeTripDuration: this.changeTripDuration,
          changeStartDate: this.changeStartDate,
          session: this.props.session,
          headerHeight,
          availabilities: this.props.availabilities,
          goToSettings: this.goToSettings,
          moveServiceAndSave: this.moveServiceAndSave,
        }}
      >
        {!this.props.session.username && <WarningLogin />}
        <Options
          onChangeGuests={this.changeGuests}
          adults={this.props.adults}
          children={this.props.children}
          infants={this.props.infants}
          startDate={trip.startDate}
          duration={trip.duration}
          changeShowTransport={this.changeShowTransport}
          changeShowMap={this.changeShowMap}
          tripParents={this.props.trip.parents}
          showingMap={this.state.showingMap}
        />
        {moment(this.props.trip.startDate).isBefore(moment(), 'day') && (
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                color: error,
                padding: '5px 20px',
                backgroundColor: `${error}50`,
                border: `1px solid ${error}`,
                display: 'inline-block',
                borderRadius: '5px',
              }}
            >
              <Trans>Your dates are in the past. Please change them.</Trans>
            </p>
          </div>
        )}
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
          price={trip.totalPrice && trip.totalPrice.toFixed(2)}
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
        {this.state.isEditingService && (
          <Modal
            className="editServiceModal"
            style={{ marginTop: '75px !important' }}
            open
            onClose={() => this.setState({ isEditingService: null })}
            closeOnDimmerClick={false}
          >
            <AddCustomServiceModal
              isEditing
              close={() => this.setState({ isEditingService: null })}
              service={fetchHelpers.buildServiceForView(servicesProps[this.state.isEditingService])}
              editService={this.modifyService}
            />
          </Modal>
        )}
      </TripContext.Provider>
    );
  }
}

export default withTouchHandler(TripOrganizer);
