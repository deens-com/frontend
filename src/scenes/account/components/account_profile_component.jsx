import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountProfileScene from './../../../styled_scenes/Account/Profile';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AccountProfileComponent extends Component {
  static propTypes = {
    user_profile: PropTypes.object,
  };

  componentDidMount() {
    this.props.fetch_user_profile();
  }

  render() {
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
}

const mapStateToProps = state => {
  return {
    user_profile: state.AccountReducer.user_profile,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountProfileComponent);
