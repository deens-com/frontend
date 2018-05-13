import React from 'react';
import PropTypes from 'prop-types';
import { Image, List } from 'semantic-ui-react';

const getTripImage = trip => {
  if (trip.picture && trip.picture.url) return trip.picture.url;
  return 'http://via.placeholder.com/350x350';
};

class TripsListInDropDown extends React.Component {
  onItemClick = trip => () => {
    this.props.onTripClick(trip);
  };

  render() {
    return (
      <List selection verticalAlign="middle" divided>
        {this.props.trips.map(trip => (
          <List.Item key={trip.objectId} onClick={this.onItemClick(trip)}>
            <Image avatar src={getTripImage(trip)} />
            <List.Content>
              <List.Header>{trip.title}</List.Header>
            </List.Content>
          </List.Item>
        ))}
        <List.Item>
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
};

TripsListInDropDown.defaultProps = {
  trips: [],
};

export default TripsListInDropDown;
