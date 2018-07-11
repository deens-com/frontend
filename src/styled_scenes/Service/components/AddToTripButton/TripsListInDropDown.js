import React from 'react';
import PropTypes from 'prop-types';
import { Image, List } from 'semantic-ui-react';
import moment from 'moment';
import styled from 'styled-components';
import placeholder from './../../../../assets/placeholder350x350.png';
window.moment = moment;

const getTripImage = trip => {
  if (trip.picture && trip.picture.url) return trip.picture.url;
  return placeholder;
};

const ItemTitle = styled.div`
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

class TripsListInDropDown extends React.Component {
  onItemClick = trip => () => {
    this.props.onTripClick(trip);
  };

  getStartTripDate = trip => {
    if (trip.beginDate) {
      return moment(trip.beginDate).format('Do MMM YYYY');
    } else {
      return undefined;
    }
  };

  getTripDuration = trip => {
    if (trip.beginDate && trip.endDate) {
      const beginMoment = moment(trip.beginDate);
      const endMoment = moment(trip.endDate);
      const diff = endMoment.diff(beginMoment, 'days') + 1;
      if (diff === 1) return `${diff} day`;
      return `${diff} days`;
    } else {
      return undefined;
    }
  };

  renderItem = trip => {
    const startDateStr = this.getStartTripDate(trip);
    const duration = this.getTripDuration(trip);
    const description = startDateStr ? `From: ${startDateStr}, Duration: ${duration}` : null;
    return (
      <List.Item key={trip.objectId} onClick={this.onItemClick(trip)}>
        <Image avatar src={getTripImage(trip)} />
        <List.Content>
          <List.Header>
            <ItemTitle>{trip.title}</ItemTitle>
          </List.Header>
          {description && <List.Description>{description}</List.Description>}
        </List.Content>
      </List.Item>
    );
  };

  render() {
    return (
      <List selection verticalAlign="middle" divided>
        {this.props.trips.map(this.renderItem)}
        <List.Item onClick={this.props.onNewTripClick}>
          <List.Icon name="add" />
          <List.Content>
            <List.Header>Create a new Trip</List.Header>
          </List.Content>
        </List.Item>
      </List>
    );
  }
}

TripsListInDropDown.propTypes = {
  trips: PropTypes.array,
  onTripClick: PropTypes.func.isRequired,
  onNewTripClick: PropTypes.func.isRequired,
};

TripsListInDropDown.defaultProps = {
  trips: [],
};

export default TripsListInDropDown;
