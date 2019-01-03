import React from 'react';
import PropTypes from 'prop-types';
import AccountSettingsScene from './../../../styled_scenes/Account/Settings';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBar';

const AccountSettingsComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed />
        <PageContent padding="24px">
          <AccountSettingsScene {...props} />
        </PageContent>
      </Page>
    </section>
  );
};

AccountSettingsComponent.propTypes = {
  user: PropTypes.object,
  hasMetaMask: PropTypes.func.isRequired,
  metaMaskError: PropTypes.object,
  signData: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
};

export default AccountSettingsComponent;
