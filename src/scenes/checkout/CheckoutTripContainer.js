import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as tripSelectors from '../trips/selectors';
import CheckoutTrip from './components/CheckoutTrip';

class CheckoutTripContainer extends Component {
  render() {
    const { trip, scheduledServices } = this.props;
    if (!trip) return null;
    return <CheckoutTrip trip={trip} scheduledServices={scheduledServices} />;
  }
}

const mapStateToProps = state => {
  return {
    trip: state.TripsReducer.trip,
    tripError: state.TripsReducer.tripError,
    scheduledServices: tripSelectors.getScheduledServices(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(CheckoutTripContainer);
