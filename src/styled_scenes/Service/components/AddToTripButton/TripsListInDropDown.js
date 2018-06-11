import React from 'react';
import PropTypes from 'prop-types';
import { Image, List } from 'semantic-ui-react';
import moment from 'moment';
window.moment = moment;

const getTripImage = trip => {
  if (trip.picture && trip.picture.url) return trip.picture.url;
  return 'http://via.placeholder.com/350x350';
};

class TripsListInDropDown extends React.Component {
  onItemClick = trip => () => {
    this.props.onTripClick(trip);
  };

  getStartTripDate = trip => {
    if (trip.beginDate) {
      return '- ' + moment(trip.beginDate).format('DD-MM-YYYY') + ', ';
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

  render() {
    return (
      <List selection verticalAlign="middle" divided>
        {this.props.trips.map(trip => (
          <List.Item key={trip.objectId} onClick={this.onItemClick(trip)}>
            <Image avatar src={getTripImage(trip)} />
            <List.Content>
              <List.Header>
                {trip.title} {this.getStartTripDate(trip)}
                {this.getTripDuration(trip)}
              </List.Header>
            </List.Content>
          </List.Item>
        ))}
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
