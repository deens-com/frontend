import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Loader, Dimmer, Message } from 'semantic-ui-react';
import { geocodeByPlaceId } from 'react-places-autocomplete';
import { getFromCoordinates } from 'libs/Utils';
import uniqBy from 'lodash.uniqby';

import { serverBaseURL } from 'libs/config';
import axios from 'libs/axios';
import { media } from 'libs/styled';
import { saveTrip } from 'libs/localStorage';
import * as tripUtils from 'libs/trips';
import axiosOriginal from 'axios';
import history from '../../main/history';
import {
  getPriceFromServiceOption,
  getPeopleCount,
  calculateBottomPosition,
  updateBottomChatPosition,
  getHeroImage,
} from 'libs/Utils';

import TopBar from 'shared_components/TopBar';
import BrandFooter from 'shared_components/BrandFooter';

import { Page } from 'shared_components/layout/Page';
import I18nText from 'shared_components/I18nText';

import Itinerary from './Itinerary';
import mapServicesToDays, {
  minutesToDays,
  dayTitles,
  updateServiceDayNames,
} from '../Trip/mapServicesToDays';
import DaySelector from '../Trip/DaySelector';
import CheckoutBox from './CheckoutBox';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import Button from 'shared_components/Button';
import Input from 'shared_components/StyledInput';
import debounce from 'lodash.debounce';

const PageContent = styled.div`
  margin: 0 20px auto;
  ${media.minLarge} {
    max-width: 650px;
    margin: 0 auto auto;
    width: 100%;
    margin-left: 150px;
  }
  ${media.minLargePlus} {
    max-width: 775px;
  }
  @media only screen and (min-width: 1400px) {
    margin: 0 auto auto;
  }
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
  margin-bottom: 30px;
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
  margin-top: 20px;
`;

const TripItineraryTitle = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  color: #c4c4c4;
  border-bottom: 1px solid #c4c4c4;
  text-align: center;
  margin-top: 50px;
  line-height: 0.1em;

  > span {
    background: white;
    padding: 0 10px;
  }
`;

const Required = () => <span style={{ color: 'red' }}>*</span>;

const daysToMinutes = days => days * 60 * 24;

function createTripState(props, state) {
  return {
    ...state,
    trip: {
      ...props.trip,
      adultCount: props.trip.adultCount || props.adults || 1,
      childrenCount: props.trip.childrenCount || props.children || 0,
      infantCount: props.trip.infantCount || props.infants || 0,
    },
    days: mapServicesToDays(
      props.trip.services,
      props.trip.duration,
      props.trip.startDate || props.startDate,
    ),
    isCheckingList: [],
    notes: props.trip.notes ? props.trip.notes : {},
  };
}

const calculatePrice = prevState => ({
  ...prevState,
  trip: {
    ...prevState.trip,
    basePrice: prevState.days.reduce((price, dayData) => {
      return (
        price +
        dayData.data.reduce((price, service) => {
          if (service.service.checkoutOptions.payAt === 'please') {
            if (service.selectedOption) {
              return price + service.selectedOption.price;
            }
            return price + service.service.basePrice;
          }
          return price;
        }, 0)
      );
    }, 0),
  },
});

function pickFirstOption(days, data) {
  const dataByDay = data.reduce((prev, value) => {
    if (!value.groupedOptions || value.groupedOptions.options.length === 0) {
      return prev;
    }

    if (!prev[value.day]) {
      return {
        ...prev,
        [value.day]: {
          [value.serviceId]: {
            availabilityCode: value.groupedOptions.options[0].otherAttributes.availabilityCode.code,
            price: value.groupedOptions.options[0].price,
          },
        },
      };
    }

    return {
      ...prev,
      [value.day]: {
        ...prev[value.day],
        [value.serviceId]: {
          availabilityCode: value.groupedOptions.options[0].otherAttributes.availabilityCode.code,
          price: value.groupedOptions.options[0].price,
        },
      },
    };
  }, {});

  return days.map(day => {
    if (dataByDay[day.day]) {
      return {
        ...day,
        data: day.data.map(service => {
          if (dataByDay[day.day] && dataByDay[day.day][service.service._id]) {
            return {
              ...service,
              selectedOption: dataByDay[day.day][service.service._id],
            };
          }
          return service;
        }),
      };
    }
    return day;
  });
}

const emptyTrip = {
  title: '',
  services: [],
  media: [],
  location: {},
  basePrice: 0,
  duration: 1,
};

const routeActions = {
  book: 'book',
  share: 'share',
};
export default class TripOrganizer extends Component {
  constructor(props) {
    super(props);

    if (props.tripId === (props.trip && props.trip._id) || !props.tripId) {
      this.state = createTripState(props, {
        availability: {},
      });
    } else {
      this.state = {
        trip: props.trip || emptyTrip,
        days: [],
        availability: {},
        pictureUploadError: null,
        uploadingPicture: false,
        isCheckingList: [],
        notes: {},
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

    return newState;
  }

  componentDidMount() {
    updateBottomChatPosition(
      calculateBottomPosition(this.props.isGDPRDismissed, this.props.gdprHeight, 60),
    );

    if (!this.props.tripId) {
      this.checkAllServicesAvailability({
        startDate: this.props.startDate,
        guests: {
          adults: this.state.trip.adultCount || this.props.adults,
          children: this.state.trip.childrenCount || this.props.children,
          infants: this.state.trip.infantCount || this.props.infants,
        },
      });
    }
  }

  componentWillUnmount() {
    updateBottomChatPosition();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.trip && this.props.trip) {
      this.checkAllServicesAvailability({
        startDate: this.props.startDate,
        guests: {
          adults: this.state.trip.adultCount,
          children: this.state.trip.childrenCount,
          infants: this.state.trip.infantCount,
        },
      });
    }
    if (prevProps.gdprHeight !== this.props.gdprHeight) {
      updateBottomChatPosition(
        calculateBottomPosition(this.props.isGDPRDismissed, this.props.gdprHeight, 60),
      );
    }
  }

  blockUntilSaved = () => {
    this.setState({
      isBlockedUntilSaved: true,
    });
  };

  patchTrip = (action = 'autosave') => {
    this.setState(
      action === 'autosave'
        ? {}
        : {
            isBlockedUntilSaved: action === 'share' || action === 'book',
            isSaving: true,
          },
      async () => {
        const trip = {
          ...this.state.trip,
          services: this.state.days.reduce(
            (prev, day) => [
              ...prev,
              ...day.data.map(dayData => ({
                ...dayData,
                service: this.props.tripId ? dayData.service._id : dayData.service,
              })),
            ],
            [],
          ),
          ...(this.props.startDate ? { startDate: this.props.startDate } : {}),
          duration: (this.state.days && daysToMinutes(this.state.days.length)) || 1,
          tags: this.state.trip.tags ? this.state.trip.tags.map(tag => tag._id) : [], // This could be done when loading the trip to avoid executing each time we save
          notes: this.state.notes,
        };

        await this.save(trip);

        this.setState(prevState => ({
          isSaving: false,
          savingPending: false,
          isBlockedUntilSaved: false,
        }));

        if (action === 'manual-save' || action === 'autosave') {
          return;
        }

        if (!this.props.tripId) {
          history.push('/login', {
            from: '/trips/organize',
            message: 'Please login or register to continue',
            action,
          });
          return;
        }

        if (action === 'share') {
          history.push(`/trips/share/${trip._id}`);
          return;
        }
        history.push(`/trips/checkout/${trip._id}`, {
          action: routeActions.book,
        });
      },
    );
  };

  save = async trip => {
    if (this.props.tripId) {
      await tripUtils.patchTrip(trip._id, trip);
      return;
    }
    saveTrip(trip);
  };

  debouncedPatch = debounce(this.patchTrip, 2000);

  autoPatchTrip = () => {
    this.setState({
      savingPending: true,
    });
    this.debouncedPatch();
  };

  selectOption = (day, instanceId, optionCode, price) => {
    this.setState(
      prevState => ({
        days: prevState.days.map(elem => {
          if (elem.day !== day) {
            return elem;
          }

          return {
            ...elem,
            data: elem.data.map(
              elemData =>
                elemData._id !== instanceId
                  ? elemData
                  : {
                      ...elemData,
                      selectedOption: {
                        availabilityCode: optionCode,
                        price,
                      },
                    },
            ),
          };
        }),
      }),
      () => {
        this.setState(calculatePrice, this.autoPatchTrip);
      },
    );
  };

  goToAddService = day => {
    const { trip } = this.state;
    const { history } = this.props;
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
        type: ['accommodation'],
        latitude: coord && coord.lat,
        longitude: coord && coord.lng,
        address,
      },
      history,
      {
        tripId: trip._id,
        day,
        duration: trip.duration,
        startDate: this.props.startDate.valueOf(),
        isCreatingTripNotLoggedIn: !Boolean(trip._id),
      },
    );
  };

  removeService = async (day, serviceId, instanceId) => {
    this.setState(prevState => {
      const services = prevState.days
        .find(elem => elem.day === day)
        .data.filter(service => service.service._id === serviceId);
      return {
        ...(services.length === 1
          ? {
              availability: {
                ...prevState.availability,
                data: prevState.availability.data
                  ? prevState.availability.data.filter(
                      elem => elem.serviceId !== serviceId || elem.day !== day,
                    )
                  : null,
                timestamp: new Date().getTime(),
              },
            }
          : null),
        days: prevState.days.map(elem => {
          if (elem.day !== day) {
            return elem;
          }

          return {
            ...elem,
            data: elem.data.filter(elemData => elemData._id !== instanceId),
          };
        }),
      };
    }, this.autoPatchTrip);
  };

  changeTripName = event => {
    const title = event.target.value;
    this.changeTripNameDebounced(title);
  };

  changeTripNameDebounced = debounce(title => {
    this.setState(
      prevState => ({
        trip: {
          ...prevState.trip,
          title: {
            'en-us': title,
          },
        },
      }),
      this.autoPatchTrip,
    );
  }, 500);

  addNote = day => {
    this.setState(
      prevState => ({
        notes: {
          ...prevState.notes,
          [day]: {
            'en-us': '',
          },
        },
      }),
      this.autoPatchTrip,
    );
  };

  editNote = debounce((day, text) => {
    this.setState(
      prevState => ({
        notes: {
          ...prevState.notes,
          [day]: {
            'en-us': text,
          },
        },
      }),
      this.patchTrip,
    );
  }, 500);

  deleteNote = day => {
    this.setState(prevState => {
      const notes = Object.keys(prevState.notes).reduce((prevNotes, value) => {
        if (value === String(day)) {
          return prevNotes;
        }
        return {
          ...prevNotes,
          [value]: prevState.notes[value],
        };
      }, {});

      return {
        notes,
      };
    }, this.autoPatchTrip);
  };

  goToDay = index => {
    const domNode = ReactDOM.findDOMNode(this.childRefs[index].current);
    domNode.scrollIntoView(true);
    window.scrollBy(0, -75); // To avoid the header blocking a part of the day
  };

  assignRefs = refs => {
    this.childRefs = refs;
  };

  requestAvailability = async data => {
    if (this.props.tripId) {
      return axios.get(
        `/trips/${this.state.trip._id}/availability?bookingDate=${data.bookingDate}&adultCount=${
          data.adultCount
        }&childCount=${data.childCount}&infantCount=${data.infantCount}`,
      );
    }

    const response = await axios.post('/trips/anonymous-availability', {
      ...data,
      tripData: {
        ...this.state.trip,
        services: this.state.trip.services.map(service => ({
          ...service,
          service: service.service._id,
        })),
      },
    });

    return response;
  };

  checkAllServicesAvailability = ({ startDate, guests }) => {
    const timestamp = new Date().getTime();
    this.setState(
      prevState => ({
        availability: {
          ...prevState.availability,
          data: [],
          isChecking: true,
          timestamp,
        },
        isCheckingList: [],
      }),
      async () => {
        const checkdata = {
          bookingDate: startDate.clone().format('YYYY-MM-DD'),
          adultCount: guests.adults,
          childCount: guests.children,
          infantCount: guests.infants,
          peopleCount: guests.adults + guests.children + guests.infants,
        };
        const response = await this.requestAvailability(checkdata);

        // Probably we should not use day but this implies lot of changes
        const processedData = response.data.map(availability => {
          let tripService = this.state.trip.services.find(
            service => availability.serviceOrganizationId === service._id,
          );
          if (!tripService) {
            this.state.trip.services.find(
              service => console.log(service), //availability.serviceId === service.service._i
            );
          }
          return {
            ...availability,
            day: tripService.day,
          };
        });

        const data = uniqBy(processedData, elem => `${elem.day}-${elem.serviceId}`);

        this.setState(prevState =>
          calculatePrice({
            ...prevState,
            days: pickFirstOption(prevState.days, data),
            availability: {
              data,
              error: null,
              isChecking: false,
              timestamp,
            },
          }),
        );
      },
    );
  };

  changeDates = dates => {
    this.checkAllServicesAvailability({
      startDate: moment(dates.start_date),
      guests: {
        adults: this.state.trip.adultCount,
        children: this.state.trip.childrenCount,
        infants: this.state.trip.infantCount,
      },
    });
    this.props.changeDates(dates);
    this.autoPatchTrip();
    this.setState(prevState => ({
      days: updateServiceDayNames(prevState.days, dates.start_date),
    }));
  };

  changeGuests = data => {
    this.setState(prevState => ({
      trip: {
        ...prevState.trip,
        adultCount: data.adults,
        childrenCount: data.children,
        infantCount: data.infants,
      },
    }));
    this.checkAllServicesAvailability({
      startDate: this.props.startDate,
      guests: data,
    });

    this.props.changeDates(data);
    this.autoPatchTrip();
  };

  handleAddDay = () => {
    this.setState(
      prevState => ({
        trip: {
          ...prevState.trip,
          duration: prevState.trip.duration + daysToMinutes(1),
        },
        days: [
          ...prevState.days,
          prevState.days.length > 0
            ? {
                ...dayTitles(
                  prevState.days[prevState.days.length - 1].day + 1,
                  this.props.startDate,
                ),
                day: prevState.days[prevState.days.length - 1].day + 1,
                data: [],
              }
            : {
                ...dayTitles(1, this.props.startDate),
                day: 1,
                data: [],
              },
        ],
      }),
      this.autoPatchTrip,
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
              city: (localities[0] || addressComponents[0]).long_name,
              state: state.lenth > 0 ? state[0].long_name : '',
              countryCode: countries[0].short_name,
              geo: {
                type: 'Point',
                coordinates: [lngFn(), latFn()],
              },
            },
          },
        }),
        this.autoPatchTrip,
      );
    } catch (e) {
      console.error(e);
    }
  };

  getBookError = () => {
    if (!this.props.startDate) {
      return 'You need to select a start date';
    }

    const checkingAvailability =
      !this.state.availability ||
      this.state.availability.isChecking ||
      this.state.isCheckingList.length > 0 ||
      !this.state.availability.data;

    if (checkingAvailability) {
      return 'We are checking the availability of the selected services';
    }

    if (!this.state.availability.data || this.state.availability.data.length === 0) {
      return 'You have to add services to the current trip';
    }

    const options = [];
    const servicesAreAvailable = this.state.availability.data.some(value => {
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
    if (file.size > 3000000) {
      this.setState({ pictureUploadError: 'File size should not exceed 3 Mb' });
      return;
    }
    this.setState({
      uploadingPicture: true,
    });
    const formData = new FormData();
    formData.append('profilePicture', file);
    const uploadedFile = await axiosOriginal.post(`${serverBaseURL}/media`, formData, {});

    const url = uploadedFile.data.url;
    this.setState(
      prev => ({
        pictureUploadError: null,
        uploadingPicture: false,
        trip: {
          ...prev.trip,
          media: [
            {
              type: 'image',
              hero: true,
              names: {
                'en-us': 'Trip image',
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
      this.autoPatchTrip,
    );
  };

  removeDay = day => {
    this.setState(
      prevState => {
        const notes = Object.keys(prevState.notes).reduce((prevNotes, value) => {
          if (Number(value) === day.day) {
            return prevNotes;
          }

          const newKey = value > day.day ? value - 1 : value;

          return {
            ...prevNotes,
            [newKey]: prevState.notes[value],
          };
        }, {});

        return {
          trip: {
            ...prevState.trip,
            duration: prevState.trip.duration - daysToMinutes(1),
          },
          notes,
          days: prevState.days.filter(prevDay => prevDay.day !== day.day).map(
            prevDay =>
              prevDay.day < day.day
                ? prevDay
                : {
                    ...prevDay,
                    ...dayTitles(prevDay.day - 1, this.props.startDate),
                    day: prevDay.day - 1,
                    data: prevDay.data.map(serv => ({
                      ...serv,
                      day: prevDay.day - 1,
                    })),
                  },
          ),
        };
      },
      () => {
        this.checkAllServicesAvailability({
          startDate: this.props.startDate,
          guests: {
            adults: this.state.trip.adultCount,
            children: this.state.trip.childrenCount,
            infants: this.state.trip.infantCount,
          },
        });
        this.autoPatchTrip();
      },
    );
  };

  renderPageContent = () => {
    const { startDate } = this.props;
    const {
      availability,
      trip,
      days,
      pictureUploadError,
      isCheckingList,
      notes,
      uploadingPicture,
    } = this.state;

    const hero = trip && getHeroImage(trip);
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
        {pictureUploadError && (
          <Message negative>
            <Message.Header>An error occured</Message.Header>
            <p>{pictureUploadError}</p>
          </Message>
        )}
        <CoverImage url={img}>
          {uploadingPicture ? (
            <Loader active inline="centered" />
          ) : (
            <React.Fragment>
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
            </React.Fragment>
          )}
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
            useStyledInput
          />
        </FormInput>
        <TripItineraryTitle>
          <span>Trip Itinerary</span>
        </TripItineraryTitle>
        <CheckoutBox
          trip={trip}
          days={days}
          action={this.patchTrip}
          isSaving={this.state.isSaving || this.state.savingPending}
          changeDates={this.changeDates}
          changeGuests={this.changeGuests}
          startDate={startDate}
          adults={trip.adultCount}
          children={trip.childrenCount}
          infants={trip.infantCount}
          price={(trip.basePrice || 0).toFixed(2)}
          bookError={this.getBookError()}
          shareError={this.getShareError()}
          numberOfDays={minutesToDays(trip.duration)}
        />
        <Itinerary
          isCheckingAvailability={availability.isChecking}
          isCheckingList={isCheckingList}
          availability={availability.data}
          trip={trip}
          numberOfPeople={trip.adultCount + trip.childrenCount + trip.infantCount}
          startDate={startDate}
          assignRefsToParent={this.assignRefs}
          days={days}
          notes={notes}
          selectOption={this.selectOption}
          goToAddService={this.goToAddService}
          removeService={this.removeService}
          removeDay={this.removeDay}
          addNote={this.addNote}
          editNote={this.editNote}
          deleteNote={this.deleteNote}
          isSaving={this.state.isSaving || this.state.savingPending}
          blockUntilSaved={this.blockUntilSaved}
        />
      </React.Fragment>
    );
  };

  render() {
    const { isLoading, tripId, isGDPRDismissed, gdprHeight } = this.props;
    const { trip, isBlockedUntilSaved, days } = this.state;

    const loading = isLoading || (!trip || trip._id !== tripId);

    return (
      <Page>
        <TopBar fixed />
        <Dimmer active={isBlockedUntilSaved} page>
          <Loader size="massive" />
        </Dimmer>
        {!loading && (
          <DaySelector
            bottom={calculateBottomPosition(isGDPRDismissed, gdprHeight)}
            days={days}
            goToDay={this.goToDay}
            onAddDay={this.handleAddDay}
          />
        )}
        <PageContent>
          {loading ? <Loader inline="centered" active size="massive" /> : this.renderPageContent()}
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}
