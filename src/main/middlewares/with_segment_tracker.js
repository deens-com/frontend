import React, { Component } from 'react';
import analytics from 'libs/analytics';

const withSegmentTracker = (WrappedComponent, options = {}) => {
  const HOC = class extends Component {
    componentDidMount() {
      console.log('jeje', this.props.location.pathname);
      const page = this.props.location.pathname;
      analytics.page(page);
    }

    componentWillReceiveProps(nextProps) {
      /*const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        console.log('jejeaaaa', currentPage, nextPage)
        analytics.page(nextPage);
      }*/
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};

export default withSegmentTracker;
