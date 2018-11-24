import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Modal, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import history from 'main/history';

import PriceTag from 'shared_components/Currency/PriceTag';
import { media } from 'libs/styled';
import BookedSuccessfullyPopup from '../BookedSuccessfullyPopup';
import StripeCardDetails from '../StripeCardDetails';
import CoinbaseButtonContainer from '../../CoinbaseButtonContainer';

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

const CoinbaseButtonWrapper = styled.div`
  margin-top: 20px;
`;

const PlsPaymentButtonWrapper = styled.div`
  margin-top: 20px;
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

const RestaurantPayments = styled.div`
  color: #6e7885;
  font-size: 12px;
  margin: auto;
  text-align: center;
  margin-bottom: 20px;
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
  width: 130px;
  height: 130px;
  flex-direction: row;
  border-radius: 5px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px 0px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding-top: 20px;
  font-size: 14px;
  font-weight: bold;
`;

const Logos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const CreditCardLogos = styled(Logos)`
  > img {
    width: 34px;
    height: 20px;
    margin-bottom: 10px;
  }
`;

const CryptoLogos = styled(Logos)`
  margin: 0 25px;
  > img {
    width: 28px;
    height: 28px;
    margin-bottom: 10px;
  }
`;

const PLSLogoWrapper = styled(Logos)`
  > img {
    width: 52px;
    height: 52px;
  }
`;

const CREDIT_CARD_METHOD = 'credit-card';
const CRYPTO_METHOD = 'crypto';
const PLS_METHOD = 'pls';

export default class PaymentSection extends Component {
  static propTypes = {
    tripId: PropTypes.string.isRequired,
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
      tripId,
      pricePerPerson,
      totalPrice,
      numberOfPerson,
      onStripeTokenReceived,
      paymentError,
      guests,
      showStripe,
      error,
      getProvisionCodes,
      bookingStatus,
      isPaymentProcessing,
    } = this.props;

    return (
      <Dimmer.Dimmable dimmed={isPaymentProcessing}>
        <Dimmer inverted active={isPaymentProcessing}>
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
                onClick: () => history.replace(`/trips/${tripId}`),
              },
            ]}
          />
          <ChooseMethodTitle>
            <span>Choose Payment Method</span>
          </ChooseMethodTitle>
          <RestaurantPayments>
            <p>*Resturant payment is not included in the total price, please pay at restaurant</p>
          </RestaurantPayments>
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
                        <CoinbaseButtonWrapper>
                          <CoinbaseButtonContainer tripId={tripId} guests={guests} />
                        </CoinbaseButtonWrapper>
                      )}
                      {this.state.paymentMethod === PLS_METHOD && (
                        <PlsPaymentButtonWrapper>
                          <Button onClick={() => this.props.payWithPls(guests, tripId)}>
                            Pay with PLS
                          </Button>
                        </PlsPaymentButtonWrapper>
                      )}
                    </React.Fragment>
                  );
                }}
              </PriceTag>
            </StripWrap>
          </MainContent>
          <BookedSuccessfullyPopup status={bookingStatus} />
        </Wrap>
      </Dimmer.Dimmable>
    );
  }
}
