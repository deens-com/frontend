import React from 'react';
import { connect } from 'react-redux';
import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import { withRouter } from 'react-router-dom';

const Skeleton = ({ children, transparent, noSearch, noMargin, forceNotFixed }) => {
  return (
    <Page>
      <TopBar
        transparent={transparent}
        noSearch={noSearch}
        noMargin={noMargin}
        forceNotFixed={forceNotFixed}
      />
      {children}
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    transparent: state.header.transparent,
    noSearch: state.header.noSearch,
    noMargin: state.header.noMargin,
    forceNotFixed: state.header.forceNotFixed,
  };
};

export default withRouter(connect(mapStateToProps)(Skeleton));
