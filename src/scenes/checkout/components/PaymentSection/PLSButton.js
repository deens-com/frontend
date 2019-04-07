import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Button from 'shared_components/Button';
import PlsIcon from 'assets/ic_pls.svg';

import { usdToPls } from 'libs/currency';

const Wrap = styled.div`
  text-align: center;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const Balance = styled.p`
  margin-top: 6px;
  display: flex;
  flex-direction: row;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0;
  justify-content: center;
  > img {
    margin-left: 5px;
    width: 38px;
    height: 19px;
    align-self: center;
  }
`;

const USDBalance = styled.p`
  color: #6e7885;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 16px;
`;
const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  height: 35px;
  padding: 5px 0 0;
`;

const BalanceTitle = styled.p`
  color: #6e7885;
  font-size: 16px;
  margin-bottom: 0;
`;

const BuyPLS = styled.div`
  font-size: 14px;
  a {
    color: #097da8;
  }
`;

class PLSButton extends Component {
  static propTypes = {
    tripId: PropTypes.string.isRequired,
    guests: PropTypes.array.isRequired,
  };

  onChargeSuccess = _msgData => {
    this.setState({ chargeSuccess: true });
  };

  handleClick = () => {
    this.props.onClick(this.props.guests, this.props.tripId);
  };

  render() {
    const { paymentError, usdAmount } = this.props;
    return (
      <Wrap>
        <BalanceTitle>Your PLS Balance</BalanceTitle>
        <Balance>
          {this.props.plsBalance}
          <img src={PlsIcon} alt="PLS" />
        </Balance>
        <USDBalance>USD {(this.props.plsBalance * 0.036).toFixed(2)}</USDBalance>

        <Balance>
          You will pay {usdToPls(usdAmount)}
          <img src={PlsIcon} alt="PLS" />
        </Balance>
        <USDBalance>USD {usdAmount.toFixed(2)}</USDBalance>

        <Button theme="fillLightGreen" onClick={this.handleClick}>
          Pay with PLS
        </Button>

        <ErrorMessage>
          {paymentError ? paymentError.customMessage || paymentError.message : ' '}
        </ErrorMessage>

        <BuyPLS>
          <Link target="_blank" to="/token-sale">
            Add funds in PLS
          </Link>
        </BuyPLS>
      </Wrap>
    );
  }
}

export default PLSButton;
