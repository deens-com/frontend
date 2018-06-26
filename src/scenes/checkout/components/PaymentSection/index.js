import React from 'react';
import PropTypes from 'prop-types';
import { Button, Label, Grid } from 'semantic-ui-react';
import styled from 'styled-components';

import PriceTag from '../../../../shared_components/Currency/PriceTag';
import { media } from '../../../../libs/styled';
import BookedSuccessfullyPopup from '../BookedSuccessfullyPopup';

const Wrap = styled.div`
  ${media.minSmall} {
    margin-top: 50px;
  }
  display: flex;
  justify-content: center;
`;

const PaymentSection = ({ pricePerPerson, totalPrice, onPaymentClick, isLoading }) => (
  <Wrap>
    <Grid>
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
                    {convertedPrice}
                    {symbol}
                  </PriceTag.PriceStyle>
                </Label>
              </Button>
            )}
          </PriceTag>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <BookedSuccessfullyPopup />
  </Wrap>
);

PaymentSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  pricePerPerson: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  onPaymentClick: PropTypes.func.isRequired,
};

export default PaymentSection;
