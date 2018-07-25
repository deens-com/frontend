import React from 'react';
import ViewTripContainer from './containers/ViewTripContainer';
import EditTripContainer from './containers/EditTripContainer';
import PreBookingPopupContainer from './containers/PreBookingPopupContainer';
import { Route } from 'react-router-dom';

const Trips = props => {
  return (
    <div className="Trips">
      <Route
        exact
        path={process.env.PUBLIC_URL + '/trips/:id'}
        render={props => <ViewTripContainer {...props} />}
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
