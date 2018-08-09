import React from 'react';
import PropTypes from 'prop-types';
import { CardElement } from 'react-stripe-elements';
import styled from 'styled-components';
import CustomColorSemanticButton from 'shared_components/CustomColorSemanticButton';
import { PaymentContextConsumer } from '../PaymentContainer';

const Wrapper = styled.div`
  border-style: none;
  padding: 5px;
  margin-left: -5px;
  margin-right: -5px;
  background: rgba(18, 91, 152, 0.05);
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  margin-top: 20px;

  p {
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #8898aa;
    padding: 3px 10px 7px;
    margin: 0;
  }
`;

const CardInputWrapper = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  padding: 3px;
`;

const StyledCardElement = styled(CardElement)`
  padding: 10px;
  margin-bottom: 2px;
`;

const StripeCardDetails = ({ symbol, amount }) => {
  return (
    <Wrapper>
      <p>Or enter card details!</p>
      <CardInputWrapper>
        <StyledCardElement
          style={{
            base: {
              lineHeight: '42px',
              color: '#32325D',
              fontWeight: 500,
              fontFamily: 'Inter UI, Open Sans, Segoe UI, sans-serif',
              fontSize: '16px',
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: '#CFD7DF',
              },
            },
            invalid: {
              color: '#E25950',
            },
          }}
        />
        <PaymentContextConsumer>
          {({ onSubmitWithCardDetails }) => (
            <CustomColorSemanticButton
              fluid
              bgColor="rgb(95, 183, 158)"
              whiteText
              onClick={onSubmitWithCardDetails}
            >
              Pay {symbol}
              {amount}
            </CustomColorSemanticButton>
          )}
        </PaymentContextConsumer>
      </CardInputWrapper>
    </Wrapper>
  );
};

StripeCardDetails.propTypes = {
  amount: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default StripeCardDetails;
