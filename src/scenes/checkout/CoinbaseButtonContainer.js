import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import axios from 'libs/axios';
import history from 'main/history';

// i18n
import { I18n } from '@lingui/react';
import { Trans } from '@lingui/macro';

const buttonStates = {
  ready: 'ready',
  loading: 'loading',
  error: 'error',
};

const displayNone = { display: 'none' };
const coinbaseButtonDomID = 'coinbase-payment-button';

const Wrap = styled.div`
  text-align: center;
`;

const Text = styled.p`
  font-size: 12px;
  margin-top: 10px;
  > strong {
    font-weight: bold;
  }
`;

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

  onModalClosed = () => {
    if (this.state.chargeSuccess) {
      history.push('/my/trips');
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
      <Wrap>
        <Button
          onClick={this.handleClick}
          theme="fillLightGreen"
          disabled={
            this.state.buttonState === buttonStates.loading ||
            this.state.buttonState === buttonStates.error
          }
        >
          <strong>
            <Trans>Pay with Cryptocurrency</Trans>
          </strong>
        </Button>
        <CoinbaseCommerceButton
          style={displayNone}
          id={coinbaseButtonDomID}
          chargeId={this.state.chargeId}
          onChargeSuccess={this.onChargeSuccess}
          onChargeFailure={msgData => console.log('onChargeFailure', msgData)}
          onModalClosed={this.onModalClosed}
        />
        <Text>
          * <Trans>Currencies accepted</Trans>:
          <strong> Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Bitcoin Cash (BCH)</strong>
        </Text>
      </Wrap>
    );
  }
}

export default CoinbaseButtonContainer;
