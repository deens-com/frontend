import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import Payment from './components/Payment';

/**
 * Builds up the higher level blocks of the page
 */
const PaymentContainer = props => {
  /* TODO: @jaydp make the API Key a variable to change according to the environment */
  return (
    <StripeProvider apiKey="pk_test_YJMT2TRc342139N5bjZYr7EO">
      <Elements>
        <Payment tripId={props.tripId} />
      </Elements>
    </StripeProvider>
  );
};

PaymentContainer.propTypes = {};

export default PaymentContainer;
