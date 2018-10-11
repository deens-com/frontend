import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import styled from 'styled-components';

import Trigger from 'shared_components/DropPicker/Trigger';
import history from 'main/history';

const DropItem = styled.div`
  padding: 5px 10px;
  position: relative;
  cursor: pointer;
  font-size: 14px;
  float: left;
  font-weight: lighter;

  &:hover,
  &:focus {
    color: #4fb798;
  }

  &:after {
    content: '';
    width: 1px;
    height: 60%;
    background: #eef1f4;
    position: absolute;
    right: 0px;
    top: 20%;
  }

  &:last-child:after {
    display: none;
  }
`;

const popupStyles = {
  float: 'left',
  background: 'white',
  borderRadius: '4px',
  padding: '5px 10px',
  border: '0px',
  boxShadow: '0 8px 25px 0 rgba(141, 141, 141, 0.22)',
};

export default class AddNewServiceToTrip extends Component {
  static propTypes = {
    trip: PropTypes.object.isRequired,
  };

  goToResults = search_params => {
    const queryString = Object.entries(search_params)
      .map(([key, value]) => {
        if (value) {
          return `${key}=${value}`;
        }
        return undefined;
      })
      .filter(element => !!element)
      .join('&');
    history.push('/results?' + queryString);
  };

  onItemClick = serviceType => {
    const queryParams = {
      person_nb: this.props.trip.numberOfPerson,
      start_date: this.props.trip.beginDate && this.props.trip.beginDate.iso,
      serviceTypes: serviceType,
      latitude: this.props.trip.latitude,
      longitude: this.props.trip.longitude,
      address: this.props.trip.formattedAddress,
    };
    this.goToResults(queryParams);
  };

  onPlaceClick = () => this.onItemClick('place');
  onFoodClick = () => this.onItemClick('food');
  onActivityClick = () => this.onItemClick('activity');

  render() {
    return (
      <Popup
        trigger={<Trigger iconBefore="plus" size="small" round={true} text="Add new Service" />}
        content={
          <div>
            <DropItem onClick={this.onPlaceClick}>Place</DropItem>
            <DropItem onClick={this.onFoodClick}>Food</DropItem>
            <DropItem onClick={this.onActivityClick}>Activity</DropItem>
          </div>
        }
        position="left center"
        on="click"
        flowing={true}
        className="semantic-popup-wrapper"
        style={popupStyles}
        horizontalOffset={5}
      />
    );
  }
}
