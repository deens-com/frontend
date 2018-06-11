// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import Parse from 'parse';

// COMPONENTS
import PriceTag from '../../../shared_components/Currency/PriceTag';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';
import { getISODateString } from '../../../libs/Utils';

// STLYES
const Wrap = styled.div`
  ${media.minMedium} {
    display: flex;
  }
`;

const LeftCol = styled.div`
  padding: 25px;

  ${media.minMedium} {
    width: 50%;
    padding: 50px 25px;
  }
`;

const RightCol = styled.div`
  padding: 0 25px 50px 25px;

  ${media.minMedium} {
    width: 50%;
    padding: 50px 25px;
  }
`;

const TotalHint = styled.p`
  color: #6e7885;
  font-size: 13px;
  max-width: 240px;

  a {
    color: #5fb79e;
  }
`;

const BookButton = styled(Button)`
  && {
    color: #fff;
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

// MODULE
export default class TripSummary extends Component {
  state = {
    logged_in: false,
    total: 0,
    services: [],
    tripDirty: false,
  };

  componentDidMount() {
    if (Parse.User.current() === null) {
      this.setState({ logged_in: false });
    } else {
      this.setState({ logged_in: true });
    }
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
    const isStartDateDirty = getISODateString(query.startDate) !== getISODateString(trip.beginDate || '');
    const isEndDateDirty = getISODateString(query.endDate) !== getISODateString(trip.endDate || '');
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
      <Wrap>
        <LeftCol xsBasis="100%" mdBasis="50%">
          {/* kept this left block intact while removing service category counts */}
          {/* becuase looks like it could be used for something */}
        </LeftCol>
        <RightCol xsBasis="100%" mdBasis="50%">
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column stretched>Price per person</Grid.Column>
              <Grid.Column textAlign="right">
                <PriceTag price={this.calculateTripTotalPrice()} unit="hidden" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column stretched>Total Price</Grid.Column>
              <Grid.Column textAlign="right">
                <PriceTag price={this.calculateTripTotalPrice() * this.props.query.person.value} unit="hidden" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column textAlign="right">
                {this.state.tripDirty && <ErrorMsg>Save the trip before booking</ErrorMsg>}
                <BookButton
                  size="small"
                  circular
                  onClick={this.onBookClickWithDates}
                  loading={this.props.isCloningInProcess}
                  disabled={this.state.tripDirty || !isDatesFormComplete}
                >
                  Book now
                </BookButton>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {!this.state.logged_in && (
            <TotalHint>
              Trip is not saved! Please <Link to="/register">Sign Up</Link> or <Link to="/login">Login</Link> in order
              to save tre trip.
            </TotalHint>
          )}
        </RightCol>
      </Wrap>
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
