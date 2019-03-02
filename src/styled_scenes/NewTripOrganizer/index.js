// Stuff that would improve the codebase:
// 1- Remove trip from state, the trip should be able to be created from other stuff in the state

import React, { Component } from 'react';
/*import ReactDOM from 'react-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Loader, Dimmer } from 'semantic-ui-react';
import { getFromCoordinates } from 'libs/Utils';
import { getLocationBasedOnPlaceId, getFormattedAddress } from 'libs/trips';
import uniqBy from 'lodash.uniqby';

import axios from 'libs/axios';
import { media } from 'libs/styled';
import { saveTrip } from 'libs/localStorage';
import * as tripUtils from 'libs/trips';
import history from '../../main/history';
import { updateBottomChatPosition } from 'libs/Utils';

import BrandFooter from 'shared_components/BrandFooter';


import Itinerary from './Itinerary';
import DaySelector from '../Trip/DaySelector';
import CheckoutBox from './CheckoutBox';
import PreBookModal from './PreBookModal';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import Input from 'shared_components/StyledInput';
import debounce from 'lodash.debounce';*/
import apiClient from 'libs/apiClient';
import arrayMove from 'array-move';
import axios from 'libs/axios';
import { getHeroImage } from 'libs/Utils';
import Itinerary from './Itinerary';
import { getFromCoordinates } from 'libs/Utils';
import Header from './Header';
import Footer from './Footer';
import { mapServicesByDay, mapDaysToServices } from '../Trip/mapServicesToDays';
import Options from './Options';
import I18nText from 'shared_components/I18nText';

function addLang(text) {
  return {
    'en-us': text,
  };
}

function createStateBasedOnTrip(props) {
  const heroImage = getHeroImage(props.trip);
  return {
    services: mapServicesByDay(props.trip.services),
    tripData: {
      duration: props.trip.duration,
      startDate: props.trip.startDate || props.startDate,
      title: props.trip.title['en-us'],
      description: props.trip.description ? props.trip.description['en-us'] : '',
      location: props.trip.location,
      adultCount: props.trip.adultCount || props.adults,
      childrenCount: props.trip.childrenCount || props.children,
      infantCount: props.trip.infantCount || props.infants,
      basePrice: props.trip.basePrice || 0,
    },
    image: heroImage ? heroImage.files.hero.url : null,
    draggingDay: false,
    isSaving: false,
  };
}

export default class TripOrganizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = createStateBasedOnTrip(props);
  }

  goToAddService = day => {
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
        type: ['accommodation'],
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
        this.saveTrip({
          services: this.parseServicesForSaving(),
        });
      },
    );
  };

  changeServicePosition = (currentDay, currentPosition, nextDay, nextPosition) => {
    const saveTrip = () => {
      this.saveTrip({
        services: this.parseServicesForSaving(),
      });
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

  removeDay = day => {
    this.setState(
      prevState => {
        const duration = prevState.tripData.duration - 60 * 24;
        const services = mapServicesByDay(
          mapDaysToServices(prevState.services)
            .filter(service => {
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
      () => {
        this.saveTrip({
          services: this.parseServicesForSaving(),
          duration: this.state.tripData.duration,
        });
      },
    );
  };

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
        this.saveTrip({
          services: this.parseServicesForSaving(),
          duration: this.state.tripData.duration,
        });
      },
    );
  };

  parseServicesForSaving = () => {
    return mapDaysToServices(this.state.services).map(service => ({
      ...service,
      service: service.service._id,
    }));
  };

  uploadImage = async file => {
    const uploadedFile = await apiClient.media.post(file);

    const url = uploadedFile.data.url;
    this.setState({
      image: url,
    });

    this.saveTrip({
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
    });
  };

  editTitle = title => {
    this.setState(prevState => ({
      tripData: {
        ...prevState.tripData,
        title,
      },
    }));
    this.saveTrip({ title: addLang(title) });
  };

  editDescription = description => {
    this.setState(prevState => ({
      tripData: {
        ...prevState.tripData,
        description,
      },
    }));

    this.saveTrip({ description: addLang(description) });
  };

  changeGuests = data => {
    const newData = {
      adultCount: data.adults,
      childrenCount: data.children,
      infantCount: data.infants,
    };
    this.setState(prevState => ({
      tripData: {
        ...prevState.tripData,
        ...newData,
      },
    }));

    this.saveTrip(newData);
  };

  onChangeDate = date => {
    const newData = { startDate: date.toJSON() };

    this.setState(prevState => ({
      tripData: {
        ...prevState.tripData,
        ...newData,
      },
    }));

    this.saveTrip(newData);
  };

  saveTrip = async dataToSave => {
    this.setState({
      isSaving: true,
    });
    await axios.patch(`/trips/${this.props.trip._id}`, dataToSave).then(response => {
      this.setState({
        isSaving: false,
      });
    });
  };

  book = () => {};
  share = () => {};

  render() {
    const { draggingDay, tripData, services, image } = this.state;

    return (
      <>
        <Header
          onEditTitle={this.editTitle}
          onEditDescription={this.editDescription}
          location={tripData.location}
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
        />
        <Footer
          price={tripData.basePrice.toFixed(2)}
          book={this.book}
          share={this.share}
          isSaving={this.state.isSaving}
        />
      </>
    );
  }
}
