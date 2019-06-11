import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import withErrorBoundary from '../middlewares/WithErrorBoundary';
import BookRouter from './book';
import DesignerRouter from './designer';

import ScrollToTop from '../middlewares/ScrollToTop';

import PrivateRoute from './PrivateRoute';
import OnlyPublicRoute from './OnlyPublicRoute';

import TripCreator from 'scenes/trip-creator';
import TripQuote from 'scenes/trip-quote';
import Help from 'scenes/help';
import { asyncCommonHOCs, WaitForComponent } from './utils';

const Home = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "home", webpackPrefetch: 100 */ 'scenes/home/home')),
);
const Sessions = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "sessions" */ 'scenes/sessions/sessions')),
);
const UserVerification = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "user-verification" */ 'scenes/user-verification')),
);
const Registrations = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "registrations" */ 'scenes/registrations/registrations'),
  ),
);
const RecoverPassword = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "recover-password" */ 'scenes/recover-password')),
);
const EarnMoney = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "earn-money" */ 'scenes/earn-money')),
);
const SearchResults = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "results", webpackPrefetch: true */ 'scenes/results/results'),
  ),
);
const ServiceUpsert = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "service-upsert" */ 'scenes/service-upsert')),
);
const Users = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "users" */ 'scenes/users/users')),
);
const Account = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "account" */ 'scenes/account/account')),
);
const Blog = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "blog" */ 'scenes/blog')),
);
const Notfound = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "not-found" */ 'styled_scenes/NotFound')),
);
const AdminModeration = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "moderation" */ 'scenes/admin-moderation')),
);

const BlogRoute = ({ type, ...rest }) => (
  <Route {...rest} render={props => <Blog type={type} {...props} />} />
);

let locationQueue = [];

const TRIPS_CREATE = '/new/trip';
const HELP = '/help';
const TRAVEL_QUOTE = '/help/travel-planning';

//const routesWithModal = [TRIPS_CREATE, HELP, ]

export default withRouter(props => {
  const { location } = props;

  const isModal = Boolean(location.state && location.state.modal);

  if (
    isModal &&
    !(locationQueue.length > 0 && locationQueue[locationQueue.length - 1] !== location)
  ) {
    props.history.replace(props.location.pathname);
  }

  useEffect(() => {
    if (props.history.action === 'REPLACE' || props.history.action === 'POP') {
      locationQueue.shift();
    }
    if (
      (props.history.action !== 'POP' || locationQueue.length === 0) &&
      (!location.state || !location.state.modal)
    ) {
      locationQueue.push(props.location);
    }
  });

  const previousLocation = locationQueue[locationQueue.length - 1];
  const currentLocation = isModal ? previousLocation : location;
  return (
    <>
      {isModal && <Route path={process.env.PUBLIC_URL + TRIPS_CREATE} component={TripCreator} />}
      {isModal && <Route path={process.env.PUBLIC_URL + HELP} component={Help} />}
      {isModal && <Route path={process.env.PUBLIC_URL + TRAVEL_QUOTE} component={TripQuote} />}
      <ScrollToTop /*dontScroll={isModal}*/>
        <Switch location={currentLocation}>
          <Route exact path={process.env.PUBLIC_URL + '/'} component={Home} />
          <Route path={process.env.PUBLIC_URL + '/book'} component={BookRouter} />
          <Route path={process.env.PUBLIC_URL + '/designer'} component={DesignerRouter} />

          <Route path={TRIPS_CREATE} component={TripCreator} />
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
          <Route path={process.env.PUBLIC_URL + '/results'} component={SearchResults} />
          <PrivateRoute path={process.env.PUBLIC_URL + '/services/new'} component={ServiceUpsert} />
          <PrivateRoute
            path={process.env.PUBLIC_URL + '/services/edit/:id'}
            component={ServiceUpsert}
          />
          <Route path={process.env.PUBLIC_URL + '/users/:userName'} component={Users} />
          <Route path={process.env.PUBLIC_URL + '/account'} component={Account} />
          <Route
            path={process.env.PUBLIC_URL + '/404'}
            component={withErrorBoundary(WaitForComponent(Notfound))}
          />
          <Route
            path={process.env.PUBLIC_URL + '/admin/moderation/trips'}
            component={AdminModeration}
          />
          {/* routes which have modal version */}
          <Route path={process.env.PUBLIC_URL + TRAVEL_QUOTE} component={TripQuote} />
          <Route path={process.env.PUBLIC_URL + HELP} component={Help} />

          <BlogRoute path={`${process.env.PUBLIC_URL}/legal/:slug`} type="legal" />
          <BlogRoute path={`${process.env.PUBLIC_URL}/about/:slug`} type="about" />
          <BlogRoute path={`${process.env.PUBLIC_URL}/:slug`} />
          <Route component={withErrorBoundary(WaitForComponent(Notfound))} />
        </Switch>
      </ScrollToTop>
    </>
  );
});
