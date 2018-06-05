import React from 'react';
import PropTypes from 'prop-types';
import TripDay from './TripDay';

const CheckoutTrip = ({ trip, scheduledServices }) => {
  const tripDays = scheduledServices.map(({ day, services }) => (
    <TripDay key={day} dayIndex={day} services={services} />
  ));
  return (
    <div>
      <p>Your trip details are provided below. Please check them and finalize the payment</p>
      <hr />
      <h3>{trip && trip.title}</h3>
      {tripDays}
    </div>
  );
};

CheckoutTrip.propTypes = {
  trip: PropTypes.object.isRequired,
  scheduledServices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CheckoutTrip;
