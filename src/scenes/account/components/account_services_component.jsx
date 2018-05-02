import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountServicesScene from './../../../styled_scenes/Account/Services';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBar';

const AccountServicesComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent padding="24px">
          <AccountServicesScene {...props} />
        </PageContent>
      </Page>
    </section>
  );
};

AccountServicesComponent.propTypes = {
  user: PropTypes.object,
};

export default AccountServicesComponent;
