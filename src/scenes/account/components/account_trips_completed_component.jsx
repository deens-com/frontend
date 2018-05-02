import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountTripsCompletedScene from './../../../styled_scenes/Account/Trips/Completed';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBar';

const AccountTripsCompletedComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent padding="24px">
          <AccountTripsCompletedScene {...props} />
        </PageContent>
      </Page>
    </section>
  );
};

export default AccountTripsCompletedComponent;
