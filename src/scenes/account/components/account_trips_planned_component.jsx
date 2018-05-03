import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountTripsPlannedScene from './../../../styled_scenes/Account/Trips/Planned';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';

const AccountTripsPlannedComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent padding="24px">
          <AccountTripsPlannedScene {...props} user_profile={props.user_profile} />
        </PageContent>
      </Page>
    </section>
  );
};

export default AccountTripsPlannedComponent;
