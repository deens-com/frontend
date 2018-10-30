import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import Payment from './components/Payment';
import { stripeKey } from 'libs/config';

/**
 * Builds up the higher level blocks of the page
 */
const Wrapper = ({ apiKey, children }) => {
  if (apiKey) {
    return <StripeProvider apiKey={apiKey}>{children}</StripeProvider>;
  }

  return children;
};
const PaymentContainer = props => {
  return (
    <Wrapper apiKey={stripeKey}>
      <Elements>
        <Payment nextStep={props.nextStep} guests={props.guests} trip={props.trip} />
      </Elements>
    </Wrapper>
  );
};

PaymentContainer.propTypes = {};

export default PaymentContainer;
