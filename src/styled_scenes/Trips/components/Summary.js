// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import Parse from 'parse';
import moment from 'moment';

// COMPONENTS
import PriceTag from '../../../shared_components/Currency/PriceTag';

// ACTIONS/CONFIG
//import { media } from '../../../libs/styled';
import { getISODateString } from '../../../libs/Utils';

// STLYES
const Wrap = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

// const TotalHint = styled.p`
//   color: #6e7885;
//   font-size: 15px;
//   max-width: 360px;
//
//   a {
//     color: #5fb79e;
//   }
// `;

const BookButton = styled(Button)`
  && {
    color: #fff;
    position: relative;
    top: 7px;
    background-color: #5eb89e;
    border: 1px solid #5fb79e;
    :hover,
    :focus {
      color: #fff;
      background: #4ac4a1;
      border: 1px solid #5fb79e;
    }
  }
`;

const ErrorMsg = styled.div`
  color: red;
`;

const StickyWrap = styled.div`
  position: fixed;
  bottom: 0px;
  right: 0px;
  background-color: white;
  height: 60px;
  width: inherit;
`;

const PricesWrap = styled.span`
  display: flex;
  position: relative;
  top: 18px;
  margin-right: 20px;
  font-size: 22px;
`;

// MODULE
export default class TripSummary extends Component {
  state = {
    logged_in: false,
    total: 0,
    services: [],
    tripDirty: false,
  };

  componentDidMount() {
    this.setState({ tripDirty: false, logged_in: !!Parse.User.current() });
  }

  calculateTripTotalPrice() {
    let totalPrice = 0;

    this.props.scheduledServices.forEach(item => {
      item.services.forEach(service => {
        totalPrice += service.pricePerSession;
      });
    });

    return totalPrice;
  }

  onBookClickWithDates = () => {
    const { query, onBookClick } = this.props;
    onBookClick(query.startDate, query.person.value);
  };

  formatDateForCompare = date => moment(getISODateString(date)).utc().format('YYYYMMDD');

  componentWillReceiveProps(nextProps) {
    const { trip, query } = nextProps;
    if (!trip || !trip.objectId) return;
    const currentTripId = this.props.trip && this.props.trip.objectId;
    const currentUser = Parse.User.current();
    if (!currentUser) return;
    if (currentUser.id !== trip.owner.objectId || currentTripId !== trip.objectId) {
      if (this.state.tripDirty) this.setState({ tripDirty: false });
      return;
    }
    const startDateLHS = this.formatDateForCompare(query.startDate);
    const startDateRHS = this.formatDateForCompare(trip.beginDate || '');
    const endDateLHS = this.formatDateForCompare(query.endDate);
    const endDateRHS = this.formatDateForCompare(trip.endDate || '');
    const isStartDateDirty = startDateLHS !== startDateRHS;
    const isEndDateDirty = endDateLHS !== endDateRHS;
    const isPeopleCountDirty = parseInt(query.person.value, 10) !== trip.numberOfPerson;
    const isTripDirty = isStartDateDirty || isEndDateDirty || isPeopleCountDirty;
    if (this.state.tripDirty !== isTripDirty) {
      this.setState({ tripDirty: isTripDirty });
    }
  }

  render() {
    const { query } = this.props;
    const isDatesFormComplete = query.startDate && query.endDate && query.person.value;
    return (
      <StickyWrap>
        <Wrap>
          <PricesWrap>
            &nbsp;&nbsp;
            <h6>Total price per person : &nbsp;</h6>
            <PriceTag price={this.calculateTripTotalPrice()} unit="hidden" />
            &nbsp;&nbsp;
            <h6>Total Price : &nbsp;</h6>
            <PriceTag price={this.calculateTripTotalPrice() * this.props.query.person.value} unit="hidden" />
            &nbsp;&nbsp;
            {this.state.tripDirty && isDatesFormComplete && <ErrorMsg>Save the trip before booking</ErrorMsg>}
          </PricesWrap>
          <BookButton
            size="small"
            circular
            onClick={this.onBookClickWithDates}
            loading={this.props.isCloningInProcess}
            disabled={this.state.tripDirty || !isDatesFormComplete}
          >
            Book now
          </BookButton>
          {/*!this.state.logged_in && (
            <TotalHint>
            Trip is not saved! Please <Link to="/register">Sign Up</Link> or <Link to="/login">Login</Link> in order
            to save tre trip.
            </TotalHint>
          )*/}
        </Wrap>
      </StickyWrap>
    );
  }
}

// Props Validation
TripSummary.propTypes = {
  trip: PropTypes.object,
  scheduledServices: PropTypes.arrayOf(PropTypes.object),
  unScheduledServices: PropTypes.arrayOf(PropTypes.object),
  onBookClick: PropTypes.func.isRequired,
  isCloningInProcess: PropTypes.bool.isRequired,
  query: PropTypes.object,
};
