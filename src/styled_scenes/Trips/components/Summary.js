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
  };

  componentDidMount() {
    this.setState({ logged_in: !!Parse.User.current() });
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

  formatDateForCompare = date =>
    moment(getISODateString(date))
      .utc()
      .format('YYYYMMDD');

  render() {
    const { query, trip, isOwner } = this.props;
    const isDatesFormComplete = query.startDate && query.endDate && query.person.value;
    const booked = trip && trip.booked;
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
          </PricesWrap>
          <BookButton
            size="small"
            circular
            onClick={this.onBookClickWithDates}
            loading={this.props.isCloningInProcess}
            disabled={!isDatesFormComplete}
          >
            Book {booked && isOwner ? 'again' : 'now'}
          </BookButton>
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
  isOwner: PropTypes.bool.isRequired,
};
