import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const OnlyPublicRoute = ({ component: Component, session, message, ...rest }) =>
  console.log(session) || (
    <Route
      {...rest}
      render={props => {
        if (!session.level || session.level === 'anonymous') {
          return <Component {...props} />;
        }

        return (
          <Redirect
            to={{
              pathname: '/',
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
)(OnlyPublicRoute);
