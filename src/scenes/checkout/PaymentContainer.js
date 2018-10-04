import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import Payment from './components/Payment';
import { stripeKey } from 'libs/config';

/**
 * Builds up the higher level blocks of the page
 */
const PaymentContainer = props => {
  return (
    <StripeProvider apiKey={stripeKey}>
      <Elements>
        <Payment guests={props.guests} trip={props.trip} />
      </Elements>
    </StripeProvider>
  );
};

PaymentContainer.propTypes = {};

export default PaymentContainer;
