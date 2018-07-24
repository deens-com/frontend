import React from 'react';
import { withRouter } from 'react-router';
import Parse from 'parse';

export default function requireAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth();
    }

    checkAuth() {
      if (Parse.User.current() == null) {
        this.props.history.push('/login');
      }
    }

    render() {
      return Parse.User.current() ? <Component {...this.props} /> : null;
    }
  }

  return withRouter(AuthenticatedComponent);
}
