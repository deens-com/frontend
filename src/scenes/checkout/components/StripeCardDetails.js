import React from 'react';
import PropTypes from 'prop-types';
import { CardNumberElement, CardExpiryElement, CardCVCElement } from 'react-stripe-elements';
import styled from 'styled-components';
import { PaymentContextConsumer } from './Payment';

const Wrapper = styled.div`
  border-style: none;
  padding: 34px 5px;
  background: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  text-align: center;

  > p {
    width: 100%;
    text-align: center;
    font-size: 16px;
    padding: 3px 10px 7px;
    margin: 0;
  }

  .inputBase {
    border: 1px solid #ebebeb;
    border-bottom: 1px solid #097da8;
    padding: 0 7px;
    border-radius: 5px 5px 0 0;
    color: #3c434b;
    align-items: center;
    padding: 10px 7px;
    display: inline-block;
    width: 100%;

    input {
      font-weight: bold !important;
    }
  }

  .inputFocus {
    border-color: #097da8;
  }

  .inputError {
    border-color: #d98181;
  }
`;

const CardInputWrapper = styled.div`
  display: inline-block;
  width: 200px;
`;

const CVCWrapper = styled.div`
  display: inline-block;
  width: 50px;
  margin: 0 25px;
`;

const ExpiryWrapper = styled.div`
  display: inline-block;
  width: 75px;
`;

const Label = styled.div`
  font-size: 12px;
  color: #3c434b;
  text-align: left;
  font-weight: bold;
`;

const Required = styled.span`
  color: red;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  height: 35px;
  padding: 5px 0 0;
`;

const PayButton = styled.div`
  color: white;
  background-color: ${props => (props.disabled ? '#d6d6d6' : '#097DA8')};
  width: 180px;
  font-weight: bold;
  margin: auto;
  text-align: left;
  padding: 10px 20px;
  border-radius: 100px;
  position: relative;
  margin-top: 15px;
  cursor: pointer;
`;

const AmountButton = styled.div`
  background-color: ${props => (props.disabled ? '#d6d6d6' : 'white')};
  color: #3c434b;
  display: inline-block;
  position: absolute;
  right: 1px;
  height: calc(100% - 2px);
  top: 1px;
  border-radius: 0 50px 50px 0;
  padding-top: 10px;
  padding: 10px 20px 0;

  :before {
    content: '';
    border-style: solid;
    border-width: 10px 15px 10px 0;
    border-color: transparent white transparent transparent;
    position: absolute;
    left: -10px;
  }
`;

class StripeCardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.cardNumberRef = null;
    this.cvcRef = null;
    this.expiryRef = null;
  }

  focusNextInput = type => {
    if (type === 'cardNumber') {
      this.cvcRef.focus();
    }

    if (type === 'cardCvc') {
      this.expiryRef.focus();
    }

    if (type === 'cardExpiry') {
      this.expiryRef.blur();
    }
  };

  onCardNumberChange = event => {
    if (event.complete) {
      this.focusNextInput(event.elementType);
    }
  };

  render() {
    const { symbol, amount, paymentError } = this.props;

    return (
      <Wrapper>
        <p>Enter card details</p>
        <CardInputWrapper>
          <Label>
            Card Number
            <Required>*</Required>
          </Label>
          <CardNumberElement
            onChange={this.onCardNumberChange}
            style={{ base: { fontWeight: 'bold' } }}
            classes={{
              base: 'inputBase',
              focus: 'inputFocus',
              invalid: 'inputError',
              complete: 'inputFocus',
            }}
            onReady={elem => (this.cardNumberRef = elem)}
          />
        </CardInputWrapper>
        <CVCWrapper>
          <Label>
            CVC
            <Required>*</Required>
          </Label>
          <CardCVCElement
            onChange={this.onCardNumberChange}
            style={{ base: { fontWeight: 'bold', width: '50px' } }}
            classes={{
              base: 'inputBase',
              focus: 'inputFocus',
              invalid: 'inputError',
              complete: 'inputFocus',
            }}
            onReady={elem => (this.cvcRef = elem)}
          />
        </CVCWrapper>
        <ExpiryWrapper>
          <Label>
            Expiry Date
            <Required>*</Required>
          </Label>
          <CardExpiryElement
            onChange={this.onCardNumberChange}
            style={{ base: { fontWeight: 'bold', width: '50px' } }}
            classes={{
              base: 'inputBase',
              focus: 'inputFocus',
              invalid: 'inputError',
              complete: 'inputFocus',
            }}
            onReady={elem => (this.expiryRef = elem)}
          />
        </ExpiryWrapper>

        <ErrorMessage>
          {paymentError ? paymentError.customMessage || paymentError.message : ' '}
        </ErrorMessage>

        <PaymentContextConsumer>
          {({ onSubmitWithCardDetails, isPaymentProcessing }) => (
            <PayButton onClick={onSubmitWithCardDetails} disabled={isPaymentProcessing}>
              <span>Pay</span>
              <AmountButton disabled={isPaymentProcessing}>
                {symbol}
                {amount}
              </AmountButton>
            </PayButton>
          )}
        </PaymentContextConsumer>
      </Wrapper>
    );
  }
}

StripeCardDetails.propTypes = {
  amount: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  showOrInText: PropTypes.bool.isRequired,
};

export default StripeCardDetails;
