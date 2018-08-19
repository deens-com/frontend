import React, { Component } from 'react';
import AccountServicesScene from './../../../styled_scenes/Account/Services';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AccountServicesComponent extends Component {
  componentDidMount() {
    this.props.fetch_user_services();
  }

  render() {
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding {...this.props} />
          <PageContent padding="24px">
            <AccountServicesScene {...this.props} />
          </PageContent>
        </Page>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    user_services: state.AccountReducer.user_services,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountServicesComponent);
