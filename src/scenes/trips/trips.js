import React from 'react';
import TripsContainer from './containers/trips_container';
import PreBookingPopupContainer from './containers/PreBookingPopupContainer';

const Trips = props => {
  return (
    <div className="Trips">
      <TripsContainer {...props} />
      <PreBookingPopupContainer />
    </div>
  );
};

export default Trips;
