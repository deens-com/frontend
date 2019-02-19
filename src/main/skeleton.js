import React from 'react';
import { connect } from 'react-redux';
import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import { withRouter } from 'react-router';

const Skeleton = ({ children, transparent, noSearch }) => {
  return (
    <Page>
      <TopBar transparent={transparent} noSearch={noSearch} />
      {children}
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    transparent: state.header.transparent,
    noSearch: state.header.noSearch,
  };
};

export default withRouter(connect(mapStateToProps)(Skeleton));
