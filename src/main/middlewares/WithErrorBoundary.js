import React, { Component } from 'react';

export default ChildComponent => {
  return class ErrorBoundary extends Component {
    state = {
      showErrorPage: false,
    };

    componentDidCatch(error, info) {
      this.setState({ showErrorPage: true });
      console.log({ error, info });
      // TODO: @jaydp send the error to sentry
    }

    render() {
      if (!this.state.showErrorPage) {
        return <h1>no!!!!! it broke</h1>;
      }
      return <ChildComponent {...this.props} />;
    }
  };
};
