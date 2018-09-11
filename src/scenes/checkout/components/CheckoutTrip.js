import React from 'react';
import PropTypes from 'prop-types';
import TripDay from './TripDay';
import I18nText from 'shared_components/I18nText';

const CheckoutTrip = ({ trip, servicesGroupedByDay }) => {
  const tripDays = servicesGroupedByDay.map(({ day, services }) => (
    <TripDay key={day} tripBeginDate={trip.startDate} dayIndex={day} services={services} />
  ));
  return (
    <div>
      <p>Your trip details are provided below. Please check them and finalize the payment</p>
      <hr />
      <h3>
        <I18nText data={trip.title} />
      </h3>
      {tripDays}
    </div>
  );
};

CheckoutTrip.propTypes = {
  trip: PropTypes.object.isRequired,
  servicesGroupedByDay: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CheckoutTrip;
