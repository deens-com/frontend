import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncCommonHOCs } from './utils';

const Services = asyncCommonHOCs(
  React.lazy(() =>
    import(/* webpackChunkName: "services", webpackPrefetch: true */ 'scenes/services/services'),
  ),
);

const Trips = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "trip", webpackPrefetch: true */ 'scenes/trip')),
);

export default props => {
  return (
    <>
      <Switch>
        <Route path={`${props.match.path}/trip/:slug?_:id`} component={Trips} />
        <Route path={`${props.match.path}/:category/:slug?_:id`} component={Services} />
      </Switch>
    </>
  );
};
