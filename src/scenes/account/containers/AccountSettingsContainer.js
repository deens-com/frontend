import React, { Component } from 'react';
import AccountSettingsComponent from '../components/account_settings_component';

const hasMetaMask = () => typeof window.web3 !== 'undefined' && !!window.web3.currentProvider;

export default class AccountSettingsContainer extends Component {
  render() {
    return <AccountSettingsComponent {...this.props} hasMetaMask={hasMetaMask} />;
  }
}
