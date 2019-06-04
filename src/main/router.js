import React, { Suspense, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import withErrorBoundary from './middlewares/WithErrorBoundary';

import ScrollToTop from './middlewares/ScrollToTop';

import PrivateRoute from './PrivateRoute';
import OnlyPublicRoute from './OnlyPublicRoute';
import withSegmentTracker from './middlewares/with_segment_tracker';
import LoadingDots from 'shared_components/LoadingDots';

const commonHOCs = comp => withErrorBoundary(withSegmentTracker(comp));
const WaitForComponent = Component => {
  return props => (
    <Suspense fallback={<LoadingDots />}>
      <Component {...props} />
    </Suspense>
  );
};
const asyncCommonHOCs = Component => commonHOCs(WaitForComponent(Component));

const Home = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "home", webpackPrefetch: 100 */ './../scenes/home/home'),
  ),
);
const Sessions = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "sessions" */ './../scenes/sessions/sessions')),
);
const UserVerification = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "user-verification" */ '../scenes/user-verification'),
  ),
);
const Registrations = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "registrations" */ './../scenes/registrations/registrations'),
  ),
);
const RecoverPassword = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "recover-password" */ './../scenes/recover-password'),
  ),
);
const EarnMoney = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "earn-money" */ './../scenes/earn-money')),
);
const CookiePolicy = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "cookie-policy" */ './../scenes/cookie-policy')),
);
const SearchResults = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "results", webpackPrefetch: true */ './../scenes/results/results'),
  ),
);
const ServiceUpsert = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "service-upsert" */ '../scenes/service-upsert')),
);
const Services = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "services", webpackPrefetch: true */ './../scenes/services/services'),
  ),
);
const TripOrganizer = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-organizer" */ './../scenes/trip-organizer')),
);
const TripShare = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-share" */ './../scenes/trip-share')),
);
const Checkout = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "checkout" */ '../scenes/checkout')),
);
const TripCreator = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip-creator" */ './../scenes/trip-creator')),
);
const Trips = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "trip", webpackPrefetch: true */ './../scenes/trip'),
  ),
);
const Users = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "users" */ './../scenes/users/users')),
);
const Account = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "account" */ './../scenes/account/account')),
);
const Blog = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "blog" */ '../scenes/blog')),
);
const Notfound = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "not-found" */ './../styled_scenes/NotFound')),
);

let previousLocation;

export default withRouter(props => {
  const { location } = props;

  const isModal = Boolean(location.state && location.state.modal && previousLocation !== location);

  useEffect(() => {
    if (
      (props.history.action !== 'POP' || !previousLocation) &&
      (!location.state || !location.state.modal)
    ) {
      previousLocation = props.location;
    }
  });

  console.log(isModal, previousLocation);

  return (
    <>
      {isModal && <Route path={process.env.PUBLIC_URL + '/trips/create'} component={TripCreator} />}
      <ScrollToTop>
        <Switch location={isModal ? previousLocation : location}>
          <Route exact path={process.env.PUBLIC_URL + '/'} component={Home} />
          <OnlyPublicRoute path={process.env.PUBLIC_URL + '/login'} component={Sessions} />
          <Route
            path={process.env.PUBLIC_URL + '/user-verification'}
            component={UserVerification}
          />
          <OnlyPublicRoute path={process.env.PUBLIC_URL + '/register'} component={Registrations} />
          <OnlyPublicRoute
            path={process.env.PUBLIC_URL + '/recover-password'}
            component={RecoverPassword}
          />
          <Route path={process.env.PUBLIC_URL + '/earn-money'} component={EarnMoney} />
          <Route path={process.env.PUBLIC_URL + '/cookie-policy'} component={CookiePolicy} />
          <Route path={process.env.PUBLIC_URL + '/results'} component={SearchResults} />
          <PrivateRoute path={process.env.PUBLIC_URL + '/services/new'} component={ServiceUpsert} />
          <PrivateRoute
            path={process.env.PUBLIC_URL + '/services/edit/:id'}
            component={ServiceUpsert}
          />
          <Route path={process.env.PUBLIC_URL + '/services/:slug?_:id'} component={Services} />
          <Route
            path={process.env.PUBLIC_URL + '/trips/organize/:id'}
            component={TripOrganizer}
            message="Please login or register to continue with your trip."
          />
          <Route path={process.env.PUBLIC_URL + '/trips/organize'} component={TripOrganizer} />
          <PrivateRoute
            path={process.env.PUBLIC_URL + '/trips/share/:id'}
            component={TripShare}
            message="Please login or register to share your trip."
          />
          <Route path={process.env.PUBLIC_URL + '/trips/checkout/:id'} component={Checkout} />
          <Route path={process.env.PUBLIC_URL + '/trips/:slug?_:id'} component={Trips} />
          <Route path={process.env.PUBLIC_URL + '/users/:userName'} component={Users} />
          <Route path={process.env.PUBLIC_URL + '/account'} component={Account} />
          <Route
            path={process.env.PUBLIC_URL + '/404'}
            component={withErrorBoundary(WaitForComponent(Notfound))}
          />
          <Route path={process.env.PUBLIC_URL + '/:slug'} component={Blog} />
          <Route component={withErrorBoundary(WaitForComponent(Notfound))} />
        </Switch>
      </ScrollToTop>
    </>
  );
});
