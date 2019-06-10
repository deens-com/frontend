import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncCommonHOCs } from './utils';

const CookiePolicy = asyncCommonHOCs(
  React.lazy(() => import(/* webpackChunkName: "cookie-policy" */ 'scenes/cookie-policy')),
);

export default ({ tripCreatePath, ...props }) => {
  return (
    <>
      <Switch>
        <Route path={`${props.match.path}/cookies`} component={CookiePolicy} />
      </Switch>
    </>
  );
};
