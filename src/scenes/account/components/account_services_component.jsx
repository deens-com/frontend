import React from 'react';
import PropTypes from 'prop-types';
import AccountServicesScene from './../../../styled_scenes/Account/Services';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';

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
