import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import withErrorBoundary from './middlewares/WithErrorBoundary';
import Home from './../scenes/home/home';

import Notfound from './../styled_scenes/NotFound';
import ScrollToTop from './middlewares/ScrollToTop';

import PrivateRoute from './PrivateRoute';
import OnlyPublicRoute from './OnlyPublicRoute';
import withSegmentTracker from './middlewares/with_segment_tracker';

const commonHOCs = comp => withErrorBoundary(withSegmentTracker(comp));

export default (
  <ScrollToTop>
    <Switch>
      <Route exact path={process.env.PUBLIC_URL + '/'} component={commonHOCs(Home)} />
      <OnlyPublicRoute
        path={process.env.PUBLIC_URL + '/login'}
        component={commonHOCs(React.lazy(() => import('./../scenes/sessions/sessions')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/user-verification'}
        component={commonHOCs(React.lazy(() => import('../scenes/user-verification')))}
      />
      <OnlyPublicRoute
        path={process.env.PUBLIC_URL + '/register'}
        component={commonHOCs(React.lazy(() => import('./../scenes/registrations/registrations')))}
      />
      <OnlyPublicRoute
        path={process.env.PUBLIC_URL + '/recover-password'}
        component={commonHOCs(React.lazy(() => import('./../scenes/recover-password')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/earn-money'}
        component={commonHOCs(React.lazy(() => import('./../scenes/earn-money')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/token-sale'}
        component={commonHOCs(React.lazy(() => import('./../scenes/token-sale')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/token-sale/smart-contract'}
        component={commonHOCs(React.lazy(() => import('./../scenes/token-sale')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/cookie-policy'}
        component={commonHOCs(React.lazy(() => import('./../scenes/cookie-policy')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/results'}
        component={commonHOCs(React.lazy(() => import('./../scenes/results/results')))}
      />
      <PrivateRoute
        path={process.env.PUBLIC_URL + '/services/new'}
        component={commonHOCs(React.lazy(() => import('../scenes/service-upsert')))}
      />
      <PrivateRoute
        path={process.env.PUBLIC_URL + '/services/edit/:id'}
        component={commonHOCs(React.lazy(() => import('../scenes/service-upsert')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/services/:slug?_:id'}
        component={commonHOCs(React.lazy(() => import('./../scenes/services/services')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/organize/:id'}
        component={commonHOCs(React.lazy(() => import('./../scenes/trip-organizer')))}
        message="Please login or register to continue with your trip."
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/organize'}
        component={commonHOCs(React.lazy(() => import('./../scenes/trip-organizer')))}
      />
      <PrivateRoute
        path={process.env.PUBLIC_URL + '/trips/share/:id'}
        component={commonHOCs(React.lazy(() => import('./../scenes/trip-share')))}
        message="Please login or register to share your trip."
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/checkout/:id'}
        component={commonHOCs(React.lazy(() => import('../scenes/checkout')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/create'}
        component={commonHOCs(React.lazy(() => import('./../scenes/trip-creator')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/trips/:slug?_:id'}
        component={commonHOCs(React.lazy(() => import('./../scenes/trip')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/users/:userName'}
        component={commonHOCs(React.lazy(() => import('./../scenes/users/users')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/account'}
        component={commonHOCs(React.lazy(() => import('./../scenes/account/account')))}
      />
      <Route
        path={process.env.PUBLIC_URL + '/:slug'}
        component={commonHOCs(React.lazy(() => import('../scenes/blog')))}
      />
      <Route component={withErrorBoundary(Notfound)} />
    </Switch>
  </ScrollToTop>
);
