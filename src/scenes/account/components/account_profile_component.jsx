import React from 'react';
import PropTypes from 'prop-types';
import AccountProfileScene from './../../../styled_scenes/Account/Profile';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';

const AccountProfileComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent padding="24px">
          <AccountProfileScene {...props} />
        </PageContent>
      </Page>
    </section>
  );
};

AccountProfileComponent.propTypes = {
  user: PropTypes.object,
};

export default AccountProfileComponent;
