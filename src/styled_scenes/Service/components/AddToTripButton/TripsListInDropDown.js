import React from 'react';
import PropTypes from 'prop-types';
import { Image, List, Popup } from 'semantic-ui-react';
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
  onItemClick = ({ trip, day }) => () => {
    this.props.onTripClick({ trip, day });
  };

  getStartTripDate = trip => {
    if (trip.beginDate) {
      return moment(trip.beginDate).format('Do MMM YYYY');
    } else {
      return undefined;
    }
  };

  getTripDuration = trip => {
    let label = 'day';
    if (trip.duration > 1) label += 's';
    return { count: trip.duration, label };
  };

  renderItem = (trip, description) => {
    return (
      <List.Item>
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

  renderItemWithPopup = trip => {
    const startDateStr = this.getStartTripDate(trip);
    const duration = this.getTripDuration(trip);
    const description = startDateStr
      ? `From: ${startDateStr}, Duration: ${duration.count} ${duration.label}`
      : null;
    const item = this.renderItem(trip, description);
    const dayItems = [];
    for (let i = 0; i < duration.count; i++) {
      dayItems.push(
        <List.Item key={i} onClick={this.onItemClick({ trip, day: i + 1 })}>
          Day {i + 1}
        </List.Item>,
      );
    }
    return (
      <Popup key={trip.objectId} position="right center" on="click" trigger={item} keepInViewPort>
        <Popup.Header>Select Day</Popup.Header>
        <Popup.Content>
          <List selection verticalAlign="middle" divided>
            {dayItems}
          </List>
        </Popup.Content>
      </Popup>
    );
  };

  render() {
    return (
      <List selection verticalAlign="middle" divided>
        {this.props.trips.map(this.renderItemWithPopup)}
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
