import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountTripsScene from './../../../styled_scenes/Account/Trips';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBar';

const AccountTripsComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent padding="24px">
          <AccountTripsScene {...props} />
        </PageContent>
      </Page>
    </section>
  );
};

AccountTripsComponent.propTypes = {
  user: PropTypes.object,
};

export default AccountTripsComponent;
