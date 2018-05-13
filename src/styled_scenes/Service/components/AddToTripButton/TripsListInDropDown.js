import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

const TripsListInDropDown = props => {
  return (
    <List selection verticalAlign="middle" divided size="large">
      {props.trips.map(trip => (
        <List.Item key={trip.objectId}>
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
};

TripsListInDropDown.propTypes = {
  trips: PropTypes.array,
};

TripsListInDropDown.defaultProps = {
  trips: [],
};

export default TripsListInDropDown;
