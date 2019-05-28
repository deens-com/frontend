import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import ComponentLoader from './ComponentLoader';

import withErrorBoundary from './middlewares/WithErrorBoundary';

import ScrollToTop from './middlewares/ScrollToTop';

import PrivateRoute from './PrivateRoute';
import OnlyPublicRoute from './OnlyPublicRoute';
import withSegmentTracker from './middlewares/with_segment_tracker';
import LoadingDots from 'shared_components/LoadingDots';

const commonHOCs = comp => withErrorBoundary(withSegmentTracker(comp));
const WaitForComponent = loader =>
  Loadable({
    loader,
    loading: ComponentLoader,
  });

const asyncCommonHOCs = loader => commonHOCs(WaitForComponent(loader));

const Home = asyncCommonHOCs(() => import('scenes/home/home'));
const Sessions = asyncCommonHOCs(() => import('scenes/sessions/sessions'));
const UserVerification = asyncCommonHOCs(() => import('scenes/user-verification'));
const Registrations = asyncCommonHOCs(() => import('scenes/registrations/registrations'));
const RecoverPassword = asyncCommonHOCs(() => import('scenes/recover-password'));
const EarnMoney = asyncCommonHOCs(() => import('scenes/earn-money'));
//const TokenSale = asyncCommonHOCs('scenes/token-sale')
const CookiePolicy = asyncCommonHOCs(() => import('scenes/cookie-policy'));
const SearchResults = asyncCommonHOCs(() => import('scenes/results/results'));
const ServiceUpsert = asyncCommonHOCs(() => import('scenes/service-upsert'));
const Services = asyncCommonHOCs(() => import('scenes/services/services'));
const TripOrganizer = asyncCommonHOCs(() => import('scenes/trip-organizer'));
const TripShare = asyncCommonHOCs(() => import('scenes/trip-share'));
const Checkout = asyncCommonHOCs(() => import('scenes/checkout'));
const TripCreator = asyncCommonHOCs(() => import('scenes/trip-creator'));
const Trips = asyncCommonHOCs(() => import('scenes/trip'));
const Users = asyncCommonHOCs(() => import('scenes/users/users'));
const Account = asyncCommonHOCs(() => import('scenes/account/account'));
const Blog = asyncCommonHOCs(() => import('scenes/blog'));
const NotFound = withErrorBoundary(WaitForComponent(() => import('styled_scenes/NotFound')));

export default (
  <ScrollToTop>
    <Switch>
      <Route exact path={process.env.PUBLIC_URL + '/'} component={Home} />
      <OnlyPublicRoute path={process.env.PUBLIC_URL + '/login'} component={Sessions} />
      <Route path={process.env.PUBLIC_URL + '/user-verification'} component={UserVerification} />
      <OnlyPublicRoute path={process.env.PUBLIC_URL + '/register'} component={Registrations} />
      <OnlyPublicRoute
        path={process.env.PUBLIC_URL + '/recover-password'}
        component={RecoverPassword}
      />
      <Route path={process.env.PUBLIC_URL + '/earn-money'} component={EarnMoney} />
      {/*<Route path={process.env.PUBLIC_URL + '/token-sale'} component={asyncCommonHOCs(TokenSale)} />
      <Route
        path={process.env.PUBLIC_URL + '/token-sale/smart-contract'}
        component={asyncCommonHOCs(TokenSale)}
      />*/}
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
      <Route path={process.env.PUBLIC_URL + '/trips/create'} component={TripCreator} />
      <Route path={process.env.PUBLIC_URL + '/trips/:slug?_:id'} component={Trips} />
      <Route path={process.env.PUBLIC_URL + '/users/:userName'} component={Users} />
      <Route path={process.env.PUBLIC_URL + '/account'} component={Account} />
      <Route path={process.env.PUBLIC_URL + '/404'} component={NotFound} />
      <Route path={process.env.PUBLIC_URL + '/:slug'} component={Blog} />
      <Route component={NotFound} />
    </Switch>
  </ScrollToTop>
);
