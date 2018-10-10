import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
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
    tripId: PropTypes.string.isRequired,
    guests: PropTypes.array.isRequired,
  };

  state = {
    buttonState: 'ready',
  };

  getCoinbaseChargeCode = async () => {
    const { tripId, guests } = this.props;
    const options = {
      method: 'POST',
      url: `/payment/coinbase/charge/${tripId}`,
      data: { guests },
    };
    const response = await axios(options);
    this.setState({ buttonState: buttonStates.ready, chargeId: response.data.chargeId }, () => {
      const coinbaseButtonDomRef = document.getElementById(coinbaseButtonDomID);
      if (coinbaseButtonDomRef) coinbaseButtonDomRef.click();
    });
  };

  handleClick = () => {
    this.setState({ buttonState: buttonStates.loading });
    this.getCoinbaseChargeCode();
  };

  render() {
    return (
      <div>
        <Button
          onClick={this.handleClick}
          loading={this.state.buttonState === buttonStates.loading}
          disabled={
            this.state.buttonState === buttonStates.loading ||
            this.state.buttonState === buttonStates.error
          }
        >
          Pay Using Coinbase
        </Button>
        <CoinbaseCommerceButton
          style={displayNone}
          id={coinbaseButtonDomID}
          chargeId={this.state.chargeId}
          onChargeSuccess={msgData => console.log('onChargeSuccess', msgData)}
          onChargeFailure={msgData => console.log('onChargeFailure', msgData)}
          onPaymentDetected={msgData => console.log('onPaymentDetected', msgData)}
        />
      </div>
    );
  }
}

export default CoinbaseButtonContainer;
