import React from 'react';
import TripsContainer from './containers/trips_container';
import EditTripContainer from './containers/edit_trip_container';
import PreBookingPopupContainer from './containers/PreBookingPopupContainer';
import { Route } from 'react-router-dom';

const Trips = props => {
  return (
    <div className="Trips">
      <Route
        exact
        path={process.env.PUBLIC_URL + '/trips/:id'}
        render={props => <TripsContainer {...props} />}
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/:id/edit'}
        render={props => <EditTripContainer {...props} />}
      />
      <PreBookingPopupContainer />
    </div>
  );
};

export default Trips;
