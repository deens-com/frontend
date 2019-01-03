import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AccountSettingsComponent from '../components/AccountSettings';
import { signData, ledgerSignData, clearMetamaskErrors } from 'store/account/actions';

const hasMetaMask = () => typeof window.web3 !== 'undefined' && !!window.web3.currentProvider;

class AccountSettingsContainer extends Component {
  componentDidMount() {
    this.props.clearMetamaskErrors();
  }

  render() {
    return <AccountSettingsComponent {...this.props} hasMetaMask={hasMetaMask} />;
  }
}

const mapStateToProps = state => ({
  metaMaskError: state.AccountReducer.metaMaskError,
  ledger_error: state.AccountReducer.ledger_error,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ signData, ledgerSignData, clearMetamaskErrors }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountSettingsContainer);
