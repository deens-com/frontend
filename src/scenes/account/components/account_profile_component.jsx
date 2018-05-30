import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AccountProfileScene from './../../../styled_scenes/Account/Profile';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';

class AccountProfileComponent extends Component {
  
  render(){
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <AccountProfileScene {...this.props} />
          </PageContent>
        </Page>
      </section>
    );
  }
};

AccountProfileComponent.propTypes = {
  user: PropTypes.object,
};

export default AccountProfileComponent;
