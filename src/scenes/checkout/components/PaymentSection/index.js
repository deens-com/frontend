import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, Grid } from 'semantic-ui-react';
import styled from 'styled-components';

import PriceTag from 'shared_components/Currency/PriceTag';
import { media } from 'libs/styled';
import BookedSuccessfullyPopup from '../BookedSuccessfullyPopup';
import StripeAutoPaymentButton from '../StripeAutoPaymentButton';
import StripeCardDetails from '../StripeCardDetails';
import { isStripeIntegrationEnabled } from 'libs/feature-flags';

const Wrap = styled.div`
  ${media.minSmall} {
    margin-top: 50px;
  }
  display: flex;
  justify-content: center;
`;

const GuestCountStyle = styled.p`
  font-size: 18px;
  font-weight: 500;
`;

const StripWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ErrorMessage = styled.p`
  color: red;
`;

export default class PaymentSection extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    pricePerPerson: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    onPaymentClick: PropTypes.func.isRequired,
    numberOfPerson: PropTypes.number.isRequired,
    onStripeTokenReceived: PropTypes.func.isRequired,
  };

  state = {
    showStripeIntegration: isStripeIntegrationEnabled(),
    canMakeAutoPayment: false,
  };

  setCanMakeAutoPayment = boolValue => {
    this.setState({ canMakeAutoPayment: boolValue });
  };

  render() {
    const {
      pricePerPerson,
      totalPrice,
      onPaymentClick,
      numberOfPerson,
      isLoading,
      onStripeTokenReceived,
      paymentError,
    } = this.props;
    return (
      <Wrap>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column stretched>Guest(s)</Grid.Column>
            <Grid.Column textAlign="right">
              <GuestCountStyle>{numberOfPerson} adults</GuestCountStyle>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column stretched>Total price per person</Grid.Column>
            <Grid.Column textAlign="right">
              <PriceTag price={pricePerPerson} unit="hidden" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column stretched>Total Price</Grid.Column>
            <Grid.Column textAlign="right">
              <PriceTag price={totalPrice} unit="hidden" />
            </Grid.Column>
          </Grid.Row>
          {!this.state.showStripeIntegration && (
            <Grid.Row columns={1} textAlign="right">
              <Grid.Column>
                <PriceTag price={totalPrice}>
                  {({ convertedPrice, symbol }) => (
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={onPaymentClick}
                      disabled={parseFloat(convertedPrice) === 0}
                    >
                      <Button color="green" loading={isLoading}>
                        Pay
                      </Button>
                      <Label as="a" basic color="green" pointing="left">
                        <PriceTag.PriceStyle>
                          {symbol}
                          {convertedPrice}
                        </PriceTag.PriceStyle>
                      </Label>
                    </Button>
                  )}
                </PriceTag>
              </Grid.Column>
            </Grid.Row>
          )}
          {this.state.showStripeIntegration && (
            <Grid.Row>
              <Grid.Column>
                {totalPrice && (
                  <StripWrap>
                    <PriceTag price={totalPrice}>
                      {({ convertedPrice, stripeMultiplier, selectedCurrency, symbol }) => {
                        const amount = parseFloat(convertedPrice);
                        return (
                          <React.Fragment>
                            <StripeAutoPaymentButton
                              key={selectedCurrency}
                              amount={amount}
                              stripeMultiplier={stripeMultiplier}
                              currency={selectedCurrency}
                              onStripeTokenReceived={onStripeTokenReceived}
                              canMakeAutoPayment={this.setCanMakeAutoPayment}
                            />
                            {paymentError && <ErrorMessage>{paymentError.message}</ErrorMessage>}
                            <StripeCardDetails
                              amount={amount}
                              symbol={symbol}
                              showOrInText={this.state.canMakeAutoPayment}
                            />
                          </React.Fragment>
                        );
                      }}
                    </PriceTag>
                  </StripWrap>
                )}
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
        <BookedSuccessfullyPopup />
      </Wrap>
    );
  }
}
