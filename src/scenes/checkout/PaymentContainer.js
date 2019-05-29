import React from 'react';
import { Elements } from 'react-stripe-elements';
import Payment from './components/Payment';
import { stripeKey } from 'libs/config';
import AsyncStripeProvider from './AsyncStripeProvider';

/**
 * Builds up the higher level blocks of the page
 */
const Wrapper = ({ apiKey, children }) => {
  if (apiKey) {
    return <AsyncStripeProvider apiKey={apiKey}>{children}</AsyncStripeProvider>;
  }

  return children;
};
const PaymentContainer = props => {
  return (
    <Wrapper apiKey={stripeKey}>
      <Elements>
        <Payment
          getProvisionCodes={props.getProvisionCodes}
          error={props.error}
          nextStep={props.nextStep}
          guests={props.guests}
          trip={props.trip}
          finishPayment={props.finishPayment}
          startPayment={props.startPayment}
        />
      </Elements>
    </Wrapper>
  );
};

PaymentContainer.propTypes = {};

export default PaymentContainer;
