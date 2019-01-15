import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import history from 'main/history';

import PriceTag from 'shared_components/Currency/PriceTag';
import { media } from 'libs/styled';
import { generateTripSlug } from 'libs/Utils';
import StripeCardDetails from '../StripeCardDetails';
import CoinbaseButtonContainer from '../../CoinbaseButtonContainer';
import PLSButton from './PLSButton';

import VisaLogo from '../logos/visa.svg';
import MasterLogo from '../logos/mastercard.svg';
import AmexLogo from '../logos/amex.svg';
import DinersLogo from '../logos/diners.svg';
import JcbLogo from '../logos/jcb.svg';
import DiscoverLogo from '../logos/discover.svg';

import BTCLogo from '../logos/bitcoin.svg';
import ETHLogo from '../logos/ether.svg';
import LTCLogo from '../logos/ltc.svg';
import BCHLogo from '../logos/bch.svg';

import PLSLogo from '../logos/pls.svg';

const Wrap = styled.div`
  ${media.minSmall} {
    margin-top: 50px;
  }
`;

const StripWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 15px 18px;
`;

const ButtonWrapper = styled.div`
  margin: 20px auto 0;
`;

const ChooseMethodTitle = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  color: #c4c4c4;
  border-bottom: 1px solid #c4c4c4;
  text-align: center;
  margin: 30px 0;
  line-height: 0.1em;

  > span {
    background: white;
    padding: 0 10px;
  }
`;

const MainContent = styled.div`
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const MethodSelector = styled.div`
  background-color: #f9f9f9;
  display: flex;
  padding: 25px 0;
  justify-content: center;
  > div:nth-child(2) {
    margin: 0 15px;
  }
`;

const Method = styled.div`
  cursor: pointer;
  color: ${props => (props.selected ? 'white' : '#3C434B')};
  background-color: ${props => (props.selected ? '#38D39F' : '#FFFFFF')};
  flex-direction: row;
  border-radius: 5px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px 0px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  width: 114px;
  height: 100px;
  padding-top: 8px;
  ${media.minSmall} {
    width: 130px;
    height: 130px;
    padding-top: 20px;
  }
`;

const Logos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const CreditCardLogos = styled(Logos)`
  > img {
    width: 27px;
    height: 16px;
    margin-bottom: 10px;
    margin: 0 3px;
    ${media.minSmall} {
      width: 34px;
      height: 20px;
      margin: 5px 0;
    }
  }
`;

const CryptoLogos = styled(Logos)`
  margin: 0 25px;
  > img {
    width: 20px;
    height: 20px;
    margin-bottom: 10px;
    ${media.minSmall} {
      width: 28px;
      height: 28px;
    }
  }
`;

const PLSLogoWrapper = styled(Logos)`
  > img {
    width: 40px;
    height: 40px;
    ${media.minSmall} {
      width: 52px;
      height: 52px;
    }
  }
`;

const CREDIT_CARD_METHOD = 'credit-card';
const CRYPTO_METHOD = 'crypto';
const PLS_METHOD = 'pls';

export default class PaymentSection extends Component {
  static propTypes = {
    trip: PropTypes.string.isRequired,
    pricePerPerson: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    onPaymentClick: PropTypes.func.isRequired,
    numberOfPerson: PropTypes.number.isRequired,
    onStripeTokenReceived: PropTypes.func.isRequired,
    guests: PropTypes.array.isRequired,
    getProvisionCodes: PropTypes.func.isRequired,
  };

  state = {
    canMakeAutoPayment: false,
    paymentMethod: CREDIT_CARD_METHOD,
  };

  setCanMakeAutoPayment = boolValue => {
    this.setState({ canMakeAutoPayment: boolValue });
  };

  selectMethod = method => {
    this.setState({
      paymentMethod: method,
    });
  };

  render() {
    const {
      trip,
      totalPrice,
      paymentError,
      guests,
      plsBalance,
      error,
      getProvisionCodes,
      bookingStatus,
      isPaymentProcessing,
    } = this.props;

    return (
      <Dimmer.Dimmable dimmed={isPaymentProcessing}>
        <Dimmer inverted active={isPaymentProcessing || bookingStatus === 'started'}>
          <Loader />
        </Dimmer>
        <Wrap>
          <Modal
            open={Boolean(error)}
            content="There was an error with some of the services"
            size="small"
            actions={[
              {
                key: 'retry',
                content: 'Retry',
                onClick: getProvisionCodes,
              },
              {
                key: 'trip',
                content: 'Go to trip',
                onClick: () => history.replace(`/trips/${generateTripSlug(trip)}`),
              },
            ]}
          />
          <ChooseMethodTitle>
            <span>Choose Payment Method</span>
          </ChooseMethodTitle>
          <MainContent>
            <MethodSelector>
              <Method
                onClick={() => this.selectMethod(CREDIT_CARD_METHOD)}
                selected={this.state.paymentMethod === CREDIT_CARD_METHOD}
              >
                <p>Credit Card</p>
                <CreditCardLogos>
                  <img src={VisaLogo} alt="Visa" />
                  <img src={MasterLogo} alt="MasterCard" />
                  <img src={AmexLogo} alt="American Express" />
                  <img src={DiscoverLogo} alt="Discover" />
                  <img src={JcbLogo} alt="Japan Credit Bureau" />
                  <img src={DinersLogo} alt="Diners" />
                </CreditCardLogos>
              </Method>
              <Method
                onClick={() => this.selectMethod(CRYPTO_METHOD)}
                selected={this.state.paymentMethod === CRYPTO_METHOD}
              >
                <p>Cryptocurrency</p>
                <CryptoLogos>
                  <img src={BTCLogo} alt="Bitcoin" />
                  <img src={ETHLogo} alt="Ether" />
                  <img src={LTCLogo} alt="Litecoin" />
                  <img src={BCHLogo} alt="Bitcoin Cash" />
                </CryptoLogos>
              </Method>
              <Method
                onClick={() => this.selectMethod(PLS_METHOD)}
                selected={this.state.paymentMethod === PLS_METHOD}
              >
                <p>PLS Tokens</p>
                <PLSLogoWrapper>
                  <img src={PLSLogo} alt="PLS Token" />
                </PLSLogoWrapper>
              </Method>
            </MethodSelector>
            <StripWrap>
              <PriceTag price={totalPrice}>
                {({ convertedPrice, stripeMultiplier, selectedCurrency, symbol }) => {
                  const amount = parseFloat(convertedPrice);
                  return (
                    <React.Fragment>
                      {this.state.paymentMethod === CREDIT_CARD_METHOD && (
                        <StripeCardDetails
                          amount={amount}
                          symbol={symbol}
                          showOrInText={this.state.canMakeAutoPayment}
                          paymentError={paymentError}
                        />
                      )}
                      {this.state.paymentMethod === CRYPTO_METHOD && (
                        <ButtonWrapper>
                          <CoinbaseButtonContainer tripId={trip._id} guests={guests} />
                        </ButtonWrapper>
                      )}
                      {this.state.paymentMethod === PLS_METHOD && (
                        <ButtonWrapper>
                          <PLSButton
                            plsBalance={plsBalance}
                            guests={guests}
                            tripId={trip._id}
                            onClick={this.props.payWithPls}
                            paymentError={paymentError}
                            usdAmount={amount}
                          />
                        </ButtonWrapper>
                      )}
                    </React.Fragment>
                  );
                }}
              </PriceTag>
            </StripWrap>
          </MainContent>
        </Wrap>
      </Dimmer.Dimmable>
    );
  }
}
