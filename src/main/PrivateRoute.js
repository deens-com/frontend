import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, session, message, loggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (session.username) {
        return <Component {...props} />;
      }

      if (loggedIn === false) {
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                from: props.location.pathname,
                message: message || 'Please login or register to continue',
              },
            }}
          />
        );
      }

      return null;
    }}
  />
);

const mapStateToProps = state => ({
  session: state.session.session,
  loggedIn: state.session.loggedIn,
});

export default connect(
  mapStateToProps,
  null,
)(PrivateRoute);
