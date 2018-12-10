import React from 'react';
import PropTypes from 'prop-types';
import { Image, List, Popup } from 'semantic-ui-react';
import moment from 'moment';
import styled from 'styled-components';
import placeholder from './../../../../assets/placeholder350x350.svg';

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
  state = { selectedTrip: null };

  selectTrip(trip) {
    this.setState({
      selectedTrip: trip.objectId,
    });
  }

  onItemClick = ({ trip, day }) => () => {
    this.props.onTripClick({ trip, day });
  };

  getStartTripDate = trip => {
    if (trip.startDate) {
      return moment(trip.startDate).format('Do MMM YYYY');
    } else {
      return undefined;
    }
  };

  getTripLength = trip => {
    let label = 'day';
    const dayCount = trip.duration / 1440 || 0;
    if (dayCount > 1) label += 's';
    return { count: dayCount, label };
  };

  renderItem = (trip, description) => {
    return (
      <List.Item onClick={() => this.selectTrip(trip)}>
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
    const dayCountObj = this.getTripLength(trip);
    const description = startDateStr
      ? `From: ${startDateStr}, Length: ${dayCountObj.count} ${dayCountObj.label}`
      : null;
    const item = this.renderItem(trip, description);
    const dayItems = [];
    for (let i = 0; i < dayCountObj.count; i++) {
      dayItems.push(
        <List.Item key={i} onClick={this.onItemClick({ trip, day: i + 1 })}>
          Day {i + 1}
        </List.Item>,
      );
    }
    return (
      <Popup
        key={trip.objectId}
        position="right center"
        open={this.state.selectedTrip === trip.objectId}
        trigger={item}
        keepInViewPort
      >
        <div ref={this.props.daysRef}>
          <Popup.Header>Select Day</Popup.Header>
          <Popup.Content>
            <List selection verticalAlign="middle" divided>
              {dayItems}
            </List>
          </Popup.Content>
        </div>
      </Popup>
    );
  };

  render() {
    return (
      <div ref={this.props.innerRef}>
        <List selection verticalAlign="middle" divided>
          {this.props.trips.map(this.renderItemWithPopup)}
          <List.Item onClick={this.props.onNewTripClick}>
            <List.Icon name="add" />
            <List.Content>
              <List.Header>Create a new Trip</List.Header>
            </List.Content>
          </List.Item>
        </List>
      </div>
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
