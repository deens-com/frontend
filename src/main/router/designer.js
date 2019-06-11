import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncCommonHOCs } from './utils';
import PrivateRoute from './PrivateRoute';

const TripOrganizer = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-organizer" */ 'scenes/trip-organizer')),
);

const TripShare = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-share" */ 'scenes/trip-share')),
);

const Checkout = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "checkout" */ 'scenes/checkout')),
);

export default props => {
  return (
    <>
      <Switch>
        <PrivateRoute
          path={`${props.match.path}/:id/share`}
          component={TripShare}
          message="Please login or register to share your trip."
        />
        <Route path={`${props.match.path}/:id/checkout`} component={Checkout} />
        <Route path={`${props.match.path}/:id`} component={TripOrganizer} />
      </Switch>
    </>
  );
};