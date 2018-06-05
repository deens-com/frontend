import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as tripSelectors from '../trips/selectors';
import TripDay from './components/TripDay';

class CheckoutTripContainer extends Component {
  render() {
    // TODO: convert to functional component
    const { trip, scheduledServices } = this.props;
    const tripDays = scheduledServices.map(({ day, services }) => (
      <TripDay key={day} dayIndex={day} services={services} />
    ));
    return (
      <div>
        <h2>{trip && trip.title}</h2>
        {tripDays}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    trip: state.TripsReducer.trip,
    tripError: state.TripsReducer.tripError,
    scheduledServices: tripSelectors.getScheduledServices(state),
  };
};

export default connect(mapStateToProps, null)(CheckoutTripContainer);
