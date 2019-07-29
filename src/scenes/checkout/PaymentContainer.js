import React from 'react';
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
      <Payment
        getProvisionCodes={props.getProvisionCodes}
        error={props.error}
        nextStep={props.nextStep}
        guests={props.guests}
        trip={props.trip}
        finishPayment={props.finishPayment}
        startPayment={props.startPayment}
      />
    </Wrapper>
  );
};

PaymentContainer.propTypes = {};

export default PaymentContainer;
