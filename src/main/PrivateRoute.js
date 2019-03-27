import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, session, message, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (session.username) {
        return <Component {...props} />;
      }

      return (
        <Redirect
          to={{
            pathname: '/register',
            state: {
              from: props.location.pathname,
              message: message || 'Please login or register to continue',
            },
          }}
        />
      );
    }}
  />
);

const mapStateToProps = state => ({
  session: state.session.session,
});

export default connect(
  mapStateToProps,
  null,
)(PrivateRoute);
