import React, { Component } from 'react';
import analytics from 'libs/analytics';

const withSegmentTracker = (WrappedComponent, options = {}) => {
  const HOC = class extends Component {
    componentDidMount() {
      const page = this.props.location.pathname;
      analytics.page(page);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};

export default withSegmentTracker;
