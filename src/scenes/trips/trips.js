import React from 'react';
import TripsContainer from './containers/trips_container';
import EditTripContainer from './containers/edit_trip_container';
import PreBookingPopupContainer from './containers/PreBookingPopupContainer';
import { Route } from 'react-router-dom';

const Trips = props => {
  return (
    <div className="Trips">
      <TripsContainer {...props} />
      <PreBookingPopupContainer />
      <Route
        path={process.env.PUBLIC_URL + props.match.params.id + '/edit'}
        render={ props => <EditTripContainer {...props} /> }
      />
    </div>
  );
};

export default Trips;
