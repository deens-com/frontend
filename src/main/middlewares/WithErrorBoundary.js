import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import ErrorPage from 'shared_components/ErrorPage';

export default ChildComponent => {
  return class ErrorBoundary extends Component {
    state = {
      showErrorPage: false,
    };

    componentDidCatch(error, info) {
      this.setState({ showErrorPage: true });
      console.log({ error, info });
      Sentry.captureException(error, { extra: info });
    }

    render() {
      if (this.state.showErrorPage) {
        return <ErrorPage />;
      }
      return <ChildComponent {...this.props} />;
    }
  };
};
