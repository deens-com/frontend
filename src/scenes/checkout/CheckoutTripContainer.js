import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as tripSelectors from '../trips/selectors';
import CheckoutTrip from './components/CheckoutTrip';

class CheckoutTripContainer extends Component {
  render() {
    const { trip, servicesGroupedByDay } = this.props;
    if (!trip || !trip._id) return null;
    return <CheckoutTrip trip={trip} servicesGroupedByDay={servicesGroupedByDay} />;
  }
}

const mapStateToProps = state => {
  return {
    trip: state.TripsReducer.trip,
    tripError: state.TripsReducer.tripError,
    servicesGroupedByDay: tripSelectors.getServicesGroupedByDay(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(CheckoutTripContainer);
