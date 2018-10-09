import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Input, Loader } from 'semantic-ui-react';
import { geocodeByPlaceId } from 'react-places-autocomplete';

import { serverBaseURL } from 'libs/config';
import axios from 'libs/axios';
import axiosOriginal from 'axios';
import history from '../../main/history';

import TopBar from 'shared_components/TopBar';
import BrandFooter from 'shared_components/BrandFooter';

import { Page } from 'shared_components/layout/Page';
import I18nText from 'shared_components/I18nText';

import Itinerary from './Itinerary';
import mapServicesToDays from '../Trip/mapServicesToDays';
import DaySelector from '../Trip/DaySelector';
import CheckoutBox from './CheckoutBox';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import Button from 'shared_components/Button';
import { getPrice } from './Options';
import debounce from 'lodash.debounce';

const PageContent = styled.div`
  width: 825px;
  margin: auto;
`;

const CoverImage = styled.div`
  border-radius: 5px;
  height: 162px;
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url(${props => props.url});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  > input[type='file'] {
    display: none;
  }
  > div {
    flex-shrink: 1;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  display: block;
`;

const FormInput = styled.div`
  > div {
    width: 80%;
  }
`;

const Required = () => <span style={{ color: 'red' }}>*</span>;

const daysToMinutes = days => days * 60 * 24;

function createTripState(props, state) {
  const optionsSelected = {};

  const selectedServiceOptions =
    (props.trip.otherAttributes && props.trip.otherAttributes.selectedServiceOptions) || [];
  selectedServiceOptions.forEach(selected => {
    if (!optionsSelected[selected.day]) {
      optionsSelected[selected.day] = {
        [selected.serviceId]: selected.availabilityCode,
      };
      return;
    }
    optionsSelected[selected.day][selected.serviceId] = selected.availabilityCode;
  });

  const daysByService = props.trip.services.reduce((prev, service) => {
    const id = service.service._id;
    if (!prev[id]) {
      return {
        ...prev,
        [id]: [service.day],
      };
    }

    return {
      ...prev,
      [id]: [...prev[id], service.day],
    };
  }, {});

  return {
    ...state,
    trip: props.trip,
    days: mapServicesToDays(props.trip.services),
    optionsSelected,
    daysByService,
  };
}

const emptyTrip = {
  title: '',
  services: [],
  media: [],
  location: {},
  basePrice: 0,
  duration: 1,
};
export default class TripOrganizer extends Component {
  constructor(props) {
    super(props);

    if (props.tripId === (props.trip && props.trip._id)) {
      this.state = createTripState(props, {});
    } else {
      this.state = {
        trip: props.trip || emptyTrip,
        days: [],
        optionsSelected: {},
        availability: {},
        daysByService: {},
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (
      (props.trip && !state.trip) ||
      (props.tripId !== (state.trip && state.trip._id) &&
        props.tripId === (props.trip && props.trip._id))
    ) {
      newState = createTripState(props, state);
    }

    if (
      props.availability &&
      (!(state.availability && state.availability.timestamp) ||
        props.availability.timestamp === state.availability.timestamp)
    ) {
      newState = {
        ...newState,
        availability: props.availability,
      };
    }

    return newState;
  }

  patchTrip = debounce(async (action = 'autosave') => {
    let selectedServiceOptions = [];

    Object.keys(this.state.optionsSelected).forEach(day => {
      Object.keys(this.state.optionsSelected[day]).forEach(serviceId => {
        selectedServiceOptions.push({
          day: parseInt(day, 10),
          serviceId,
          availabilityCode: this.state.optionsSelected[day][serviceId],
        });
      });
    });

    const trip = {
      ...this.state.trip,
      ...(action === 'share' ? { privacy: 'public' } : {}),
      otherAttributes: {
        selectedServiceOptions,
      },
      services: this.state.days.reduce((prev, day) => [...prev, ...day.data], []),
      ...(this.props.startDate ? { startDate: this.props.startDate } : {}),
      ...(this.props.numberOfPeople ? { peopleCount: this.props.numberOfPeople } : {}),
      duration: daysToMinutes(this.state.days.length) || 1,
    };

    await axios.patch(`/trips/${trip._id}`, trip);

    if (action === 'autosave') {
      return;
    }

    if (action === 'share') {
      history.push(`/trips/${trip._id}`);
      return;
    }
    history.push(`/trips/checkout/${trip._id}`);
  }, 2000);

  selectOption = (day, serviceId, optionCode) => {
    this.setState(
      prevState => ({
        optionsSelected: {
          ...prevState.optionsSelected,
          [day]: {
            ...prevState.optionsSelected[day],
            [serviceId]: optionCode,
          },
        },
      }),
      () => {
        this.setState(
          prevState => ({
            trip: {
              ...prevState.trip,
              basePrice: prevState.availability.data.reduce((price, elem) => {
                if (
                  prevState.optionsSelected[elem.day] &&
                  prevState.optionsSelected[elem.day][elem.serviceId]
                ) {
                  const selectedElement =
                    elem.groupedOptions &&
                    elem.groupedOptions.options.find(
                      option =>
                        option.otherAttributes &&
                        option.otherAttributes.availabilityCode &&
                        option.otherAttributes.availabilityCode.code ===
                          prevState.optionsSelected[elem.day][elem.serviceId],
                    );
                  if (selectedElement) {
                    return (
                      price +
                      getPrice(
                        prevState.trip.services.find(
                          service => selectedElement.serviceId === service._id,
                        ).basePrice,
                        selectedElement.price,
                      )
                    );
                  }
                }
                return price;
              }, 0),
            },
          }),
          this.patchTrip,
        );
      },
    );
  };

  addService = async (day, service) => {
    this.setState(
      prevState => ({
        daysByService: {
          ...prevState.daysByService,
          [service._id]: [...(prevState.daysByService[service._id] || []), day],
        },
        days: prevState.days.map(elem => {
          if (elem.day !== day) {
            return elem;
          }
          return {
            ...elem,
            data: [
              ...elem.data,
              {
                day,
                priority: 1,
                notes: [],
                service,
              },
            ],
          };
        }),
      }),
      async () => {
        this.patchTrip();
        const availability =
          this.props.startDate &&
          (await axios.post(`${serverBaseURL}/services/${service._id}/availability`, {
            bookingDate: this.props.startDate
              .clone()
              .add(day - 1, 'days')
              .format('YYYY-MM-DD'),
            peopleCount: this.props.numberOfPeople,
          }));
        this.setState(prevState => ({
          ...(this.props.startDate
            ? {
                availability: {
                  ...prevState.availability,
                  data: [
                    ...(prevState.availability.data || {}),
                    {
                      isAvailable: availability.data.isAvailable,
                      groupedOptions: availability.data.groupedOptions,
                      serviceId: service._id,
                      day: day,
                    },
                  ],
                  timestamp: new Date().getTime(),
                },
              }
            : null),
        }));
      },
    );
  };

  removeService = async (day, serviceId) => {
    this.setState(prevState => {
      return {
        availability: {
          ...prevState.availability,
          data: prevState.availability.data.filter(
            elem => elem.serviceId !== serviceId || elem.day !== day,
          ),
          timestamp: new Date().getTime(),
        },
        days: prevState.days.map(elem => {
          if (elem.day !== day) {
            return elem;
          }

          return {
            ...elem,
            data: elem.data.filter(elemData => elemData.service._id !== serviceId),
          };
        }),
        daysByService: {
          ...prevState.daysByService,
          [serviceId]: prevState.daysByService[serviceId].filter(
            dayByService => dayByService !== day,
          ),
        },
      };
    }, this.patchTrip);
  };

  changeTripName = (_, data) => {
    this.setState(
      prevState => ({
        trip: {
          ...prevState.trip,
          title: {
            ['en-us']: data.value,
          },
        },
      }),
      this.patchTrip,
    );
  };

  goToDay = index => {
    const domNode = ReactDOM.findDOMNode(this.childRefs[index].current);
    domNode.scrollIntoView(true);
    window.scrollBy(0, -75); // To avoid the header blocking a part of the day
  };

  assignRefs = refs => {
    this.childRefs = refs;
  };

  checkAllServicesAvailability = ({ startDate, guests }) => {
    const timestamp = new Date().getTime();
    this.setState(
      prevState => ({
        availability: {
          ...prevState.availability,
          isChecking: true,
          timestamp,
        },
      }),
      async () => {
        const days = this.state.days.reduce(
          (prev, day) => [
            ...prev,
            ...day.data.map(data => ({
              serviceId: data.service._id,
              day: day.day,
              request: axios.post(`/services/${data.service._id}/availability`, {
                bookingDate: startDate
                  .clone()
                  .add(data.day - 1, 'days')
                  .format('YYYY-MM-DD'),
                peopleCount: guests,
              }),
            })),
          ],
          [],
        );
        const availability = await Promise.all(days.map(day => day.request));

        this.setState({
          availability: {
            data: days.map((day, index) => ({
              day: day.day,
              serviceId: day.serviceId,
              ...availability[index].data,
            })),
            error: null,
            isChecking: false,
            timestamp,
          },
        });
      },
    );
  };

  changeDates = dates => {
    this.checkAllServicesAvailability({
      startDate: moment(dates.start_date),
      guests: this.props.numberOfPeople,
    });
    this.props.changeDates(dates);
    this.patchTrip();
  };

  changeGuests = data => {
    this.checkAllServicesAvailability({
      startDate: this.props.startDate,
      guests: data.person_nb,
    });

    this.props.changeDates(data);
    this.patchTrip();
  };

  handleAddDay = () => {
    this.setState(
      prevState => ({
        trip: {
          ...prevState.trip,
          duration: prevState.trip + daysToMinutes(1),
        },
        days: [
          ...prevState.days,
          prevState.days.length > 0
            ? {
                title: `Day ${prevState.days[prevState.days.length - 1].day + 1}`,
                day: prevState.days[prevState.days.length - 1].day + 1,
                data: [],
              }
            : {
                title: 'Day 1',
                day: 1,
                data: [],
              },
        ],
        optionsSelected: {
          ...prevState.optionsSelected,
          ...(prevState.days.length > 0
            ? { [prevState.days[prevState.days.length - 1].day + 1]: {} }
            : { 1: {} }),
        },
      }),
      this.patchTrip,
    );
  };

  handleLocationChange = async (address, placeId) => {
    try {
      const results = await geocodeByPlaceId(placeId);
      const currentResult = results[0];
      const { address_components: addressComponents } = currentResult;
      const localities = addressComponents.filter(
        c => c.types.includes('locality') || c.types.includes('postal_town'),
      );
      const countries = addressComponents.filter(c => c.types.includes('country'));
      const state = addressComponents.filter(c => c.types.includes('administrative_area_level_1'));
      const { lat: latFn, lng: lngFn } = currentResult.geometry.location;

      this.setState(
        prevState => ({
          trip: {
            ...prevState.trip,
            location: {
              city: localities[0].long_name,
              state: state[0].long_name,
              countryCode: countries[0].short_name,
              geo: {
                type: 'Point',
                coordinates: [lngFn(), latFn()],
              },
            },
          },
        }),
        this.patchTrip,
      );
    } catch (e) {
      console.error(e);
    }
  };

  getBookError = () => {
    if (!this.props.startDate) {
      return 'You need to select a start date';
    }

    if (!this.props.numberOfPeople) {
      return 'You need to select a number of guests';
    }

    const options = [];
    const servicesAreAvailable =
      this.state.availability.data &&
      this.state.availability.data.some(value => {
        if (value.groupedOptions) {
          options.push({
            day: value.day,
            id: value.serviceId,
          });
        }

        return !value.isAvailable;
      });

    if (servicesAreAvailable) {
      return 'Please check that all services are available in selected dates';
    }

    const notSelected = options.some(
      value =>
        !(this.state.optionsSelected[value.day] && this.state.optionsSelected[value.day][value.id]),
    );

    if (notSelected) {
      return 'You must select the options for each service to book';
    }

    return null;
  };

  getShareError = () => {
    if (!this.state.trip.location) {
      return 'You need to add a location';
    }

    if (!this.state.trip.media || this.state.trip.media.length === 0) {
      return 'You need to add an image';
    }

    return null;
  };

  onFileSelect = async e => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePicture', file);
    const uploadedFile = await axiosOriginal.post(`${serverBaseURL}/media`, formData, {});

    const url = uploadedFile.data.url;
    this.setState(
      prev => ({
        trip: {
          ...prev.trip,
          media: [
            {
              type: 'image',
              hero: true,
              names: {
                ['en-us']: 'Trip image',
              },
              files: {
                thumbnail: {
                  url,
                  width: 215,
                  height: 140,
                },
                small: {
                  url,
                  width: 430,
                  height: 280,
                },
                large: {
                  url,
                  width: 860,
                  height: 560,
                },
                hero: {
                  url,
                  width: 860,
                  height: 560,
                },
              },
            },
          ],
        },
      }),
      this.patchTrip,
    );
  };

  renderPageContent = () => {
    const { startDate, numberOfPeople } = this.props;
    const { availability, trip, days, optionsSelected } = this.state;

    const hero = trip.media.find(media => media.hero) || trip.media[0];
    let img;

    if (hero && hero.files) {
      img = hero.files.hero ? hero.files.hero.url : trip.media.files.large.url;
    }

    let location = '';
    if (trip.location && trip.location.city) {
      location = trip.location.city;
      if (trip.location.state) {
        location = location.concat(`, ${trip.location.state}`);
      }
      if (trip.location.countryCode) {
        location = location.concat(`, ${trip.location.countryCode}`);
      }
    }

    return (
      <React.Fragment>
        <DaySelector days={days} goToDay={this.goToDay} onAddDay={this.handleAddDay} />
        <CheckoutBox
          trip={trip}
          days={days}
          action={this.patchTrip}
          changeDates={this.changeDates}
          changeGuests={this.changeGuests}
          startDate={startDate}
          numberOfPeople={numberOfPeople}
          price={trip.basePrice || 0}
          bookError={this.getBookError()}
          shareError={this.getShareError()}
        />
        <CoverImage url={img}>
          <Button
            element={({ children }) => <label htmlFor="cover-image">{children}</label>}
            onClick={e => {}}
            theme="allWhite"
            iconBefore="camera"
          >
            Change Cover
          </Button>
          <input
            id="cover-image"
            accept=".jpg, .jpeg, .png"
            type="file"
            onChange={this.onFileSelect}
          />
        </CoverImage>
        <FormInput>
          <Label>
            Trip Name <Required />
          </Label>
          <Input defaultValue={I18nText.translate(trip.title)} onChange={this.changeTripName} />
        </FormInput>
        <FormInput>
          <Label>
            Location <Required />
          </Label>
          <SemanticLocationControl
            defaultAddress={location}
            onChange={this.handleLocationChange}
            onlyCities
          />
        </FormInput>
        <Itinerary
          isCheckingAvailability={availability.isChecking}
          availability={availability.data}
          trip={trip}
          numberOfPeople={numberOfPeople}
          startDate={startDate}
          assignRefsToParent={this.assignRefs}
          days={days}
          optionsSelected={optionsSelected}
          selectOption={this.selectOption}
          addService={this.addService}
          removeService={this.removeService}
          daysByService={this.state.daysByService}
        />
      </React.Fragment>
    );
  };

  render() {
    const { isLoading, availability, tripId } = this.props;
    const { trip } = this.state;

    return (
      <Page>
        <TopBar fixed />
        <PageContent>
          {isLoading || (!trip || trip._id !== tripId) || !availability ? (
            <Loader inline="centered" active size="massive" />
          ) : (
            this.renderPageContent()
          )}
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}
