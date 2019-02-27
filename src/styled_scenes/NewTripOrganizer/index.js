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
import { DragDropContext } from 'react-beautiful-dnd';
import arrayMove from 'array-move';
import { getHeroImage } from 'libs/Utils';
import Itinerary from './Itinerary';
import Header from './Header';
import { mapServicesByDay, mapDaysToServices } from '../Trip/mapServicesToDays';
import { dayDroppablePrefix, types } from './constants';

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
    },
    image: heroImage ? heroImage.files.hero.url : null,
    draggingDay: false,
  };
}

export default class TripOrganizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = createStateBasedOnTrip(props);
  }

  onDragStart = start => {
    const { type } = start;
    if (type === types.DAY) {
      this.setState({
        draggingDay: true,
      });
    }
  };

  onDragEnd = result => {
    const { destination, source, type } = result;

    if (type === types.DAY) {
      this.setState({
        draggingDay: false,
      });
    }

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === types.DAY) {
      // we have to sum one because day === index + 1
      this.changeDayPosition(source.index + 1, destination.index + 1);
      return;
    }

    const currentDay = source.droppableId.split(dayDroppablePrefix)[1];
    const nextDay = destination.droppableId.split(dayDroppablePrefix)[1];
    this.changeServicePosition(currentDay, source.index, nextDay, destination.index);
  };

  changeDayPosition = (currentDay, nextDay) => {
    this.setState(prevState => {
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
    });
  };

  changeServicePosition = (currentDay, currentPosition, nextDay, nextPosition) => {
    if (currentDay === nextDay) {
      this.setState(prevState => {
        return {
          services: {
            ...prevState.services,
            [currentDay]: arrayMove(prevState.services[currentDay], currentPosition, nextPosition),
          },
        };
      });
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
    });
  };

  addNewDay = afterDay => {
    this.setState(prevState => {
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

      this.setState({
        services,
        tripData: {
          ...prevState.tripData,
          duration,
        },
      });
    });
  };

  editTitle = title => {
    this.setState(prevState => ({
      tripData: {
        ...prevState.tripData,
        title,
      },
    }));
  };

  editDescription = description => {
    this.setState(prevState => ({
      tripData: {
        ...prevState.tripData,
        description,
      },
    }));
  };

  render() {
    const { draggingDay, tripData, services, image } = this.state;
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <Header
          onEditTitle={this.editTitle}
          onEditDescription={this.editDescription}
          location={tripData.location}
          title={tripData.title}
          description={tripData.description}
          image={image}
        />
        <Itinerary
          addNewDay={this.addNewDay}
          summaryView={draggingDay}
          tripStartDate={tripData.startDate}
          services={services}
          duration={tripData.duration}
        />
      </DragDropContext>
    );
  }
}
