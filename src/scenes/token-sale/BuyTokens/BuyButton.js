import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import Button from 'shared_components/Button';
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import axios from 'libs/axios';

const buttonStates = {
  ready: 'ready',
  loading: 'loading',
  error: 'error',
};

const displayNone = { display: 'none' };
const coinbaseButtonDomID = 'coinbase-payment-button';

class CoinbaseButtonContainer extends Component {
  static propTypes = {
    amount: PropTypes.string.isRequired,
  };

  state = {
    buttonState: 'ready',
  };

  getCoinbaseChargeCode = async () => {
    const response = await axios.post(`/payment/coinbase/pay/ico?USD=${this.props.amount}`);
    this.setState({ buttonState: buttonStates.ready, chargeId: response.data.chargeId }, () => {
      const coinbaseButtonDomRef = document.getElementById(coinbaseButtonDomID);
      if (coinbaseButtonDomRef) coinbaseButtonDomRef.click();
    });
  };

  onModalClosed = () => {
    if (this.state.chargeSuccess) {
      this.props.onSuccess();
    }
  };

  onChargeSuccess = _msgData => {
    this.setState({ chargeSuccess: true });
  };

  handleClick = () => {
    this.setState({ buttonState: buttonStates.loading });
    this.getCoinbaseChargeCode();
  };

  render() {
    return (
      <React.Fragment>
        <Button
          onClick={this.handleClick}
          disabled={
            this.state.buttonState === buttonStates.loading ||
            this.state.buttonState === buttonStates.error ||
            !this.props.amount
          }
          padding="8px 21px"
          fontSize="14"
          theme="fillLightGreen"
        >
          {this.state.buttonState === buttonStates.loading ? (
            <Loader inline="centered" active />
          ) : (
            'Buy Tokens'
          )}
        </Button>
        <CoinbaseCommerceButton
          style={displayNone}
          id={coinbaseButtonDomID}
          chargeId={this.state.chargeId}
          onChargeSuccess={this.onChargeSuccess}
          onChargeFailure={msgData => console.log('onChargeFailure', msgData)}
          onModalClosed={this.onModalClosed}
        />
      </React.Fragment>
    );
  }
}

export default CoinbaseButtonContainer;
