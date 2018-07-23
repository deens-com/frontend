import React, { Component } from 'react';
//import {analytics} from 'segment';

const withSegmentTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    window.analytics.page(page);
    console.log(page);
  };

  const HOC = class extends Component {
    componentDidMount() {
      const page = this.props.location.pathname;
      trackPage(page);
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};

export default withSegmentTracker;
