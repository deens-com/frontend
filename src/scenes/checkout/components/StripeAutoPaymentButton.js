import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PaymentRequestButtonElement, injectStripe } from 'react-stripe-elements';

class StripeAutoPaymentButton extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    const { currency, amount } = this.props;

    // For full documentation of the available paymentRequest options, see:
    // https://stripe.com/docs/stripe.js#the-payment-request-object
    const paymentRequest = props.stripe.paymentRequest({
      country: 'US',
      currency,
      total: {
        label: 'Demo total',
        amount,
      },
    });

    paymentRequest.on('token', ({ complete, token, ...data }) => {
      console.log('Received Stripe token: ', token);
      console.log('Received customer information: ', data);
      complete('success');
    });

    paymentRequest.canMakePayment().then(result => {
      this.setState({ canMakePayment: !!result });
    });

    this.state = {
      canMakePayment: false,
      paymentRequest,
    };
  }

  render() {
    return this.state.canMakePayment ? (
      <PaymentRequestButtonElement
        paymentRequest={this.state.paymentRequest}
        className="PaymentRequestButton"
        style={{
          // For more details on how to style the Payment Request Button, see:
          // https://stripe.com/docs/elements/payment-request-button#styling-the-element
          paymentRequestButton: {
            type: 'buy',
            theme: 'dark',
            height: '64px',
          },
        }}
      />
    ) : null;
  }
}

export default injectStripe(StripeAutoPaymentButton);
