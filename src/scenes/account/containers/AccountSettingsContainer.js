import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AccountSettingsComponent from '../components/account_settings_component';
import { signData } from '../actions';

const hasMetaMask = () => typeof window.web3 !== 'undefined' && !!window.web3.currentProvider;

class AccountSettingsContainer extends Component {
  render() {
    return <AccountSettingsComponent {...this.props} hasMetaMask={hasMetaMask} />;
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ signData }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettingsContainer);
