import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncCommonHOCs } from './utils';
import PrivateRoute from './PrivateRoute';

const TripOrganizer = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-organizer" */ 'scenes/trip-organizer')),
);

const TripDesigner = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-designer" */ 'scenes/trip-designer')),
);

const TripPreview = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-preview" */ 'scenes/trip-preview')),
);

const TripSettings = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-settings" */ 'scenes/trip-settings')),
);

const TripShare = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-share" */ 'scenes/trip-share')),
);

const Checkout = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "checkout" */ 'scenes/checkout')),
);

const Success = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "checkout-success" */ 'scenes/success')),
);

const Failure = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "checkout-failure" */ 'scenes/failure')),
);

export default props => {
  return (
    <>
      <Route path={`${props.match.path}/:id`} component={TripDesigner} />
      <Switch>
        <PrivateRoute
          path={`${props.match.path}/:id/share`}
          component={TripShare}
          message="Please login or register to share your trip."
        />
        <Route path={`${props.match.path}/:id/checkout/success`} component={Success} />
        <Route path={`${props.match.path}/:id/checkout/failure`} component={Failure} />
        <Route path={`${props.match.path}/:id/checkout`} component={Checkout} />
        <Route path={`${props.match.path}/:id/settings`} component={TripSettings} />
        <Route path={`${props.match.path}/:id/preview`} component={TripPreview} />
        <Route path={`${props.match.path}/:id`} component={TripOrganizer} />
      </Switch>
    </>
  );
};
