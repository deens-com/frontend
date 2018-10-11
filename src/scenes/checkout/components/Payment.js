import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectStripe } from 'react-stripe-elements';
import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';

import PaymentSection from './PaymentSection';
import * as actions from '../actions';
import { statuses } from 'libs/fetch_helpers';

const PaymentContext = React.createContext();

/**
 * For components deep down in the hierarchy make use of this context
 * instead of Prop Drilling
 */
export const PaymentContextConsumer = PaymentContext.Consumer;

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaymentProcessing: false,
      paymentError: null,
    };
  }

  onStripeTokenReceived = (token, complete) => {
    this.props.chargeStripeToken(token, this.props.guests, complete);
  };

  onSubmitWithCardDetails = async () => {
    this.setState({ isPaymentProcessing: true, paymentError: null });
    try {
      // TODO: @jaydp use the customer's name in the below line
      const { token, error } = await this.props.stripe.createToken({ name: 'Customer name' });
      if (error) {
        alert(error);
        this.setState({ isPaymentProcessing: false });
        return;
      }
      this.onStripeTokenReceived(token, status => {
        this.setState({ isPaymentProcessing: false });
        if (status === 'success') {
          this.props.nextStep();
        }
      });
    } catch (error) {
      alert(error);
      this.setState({ isPaymentProcessing: false });
    }
  };

  render() {
    const { trip } = this.props;
    if (!trip || !trip._id) return null;
    const totalPrice = trip.basePrice * (trip.numberOfPerson || 1);
    return (
      <PaymentContext.Provider
        value={{
          onSubmitWithCardDetails: this.onSubmitWithCardDetails,
          totalPrice,
          ...this.state,
        }}
      >
        <PaymentSection
          numberOfPerson={trip.peopleCount}
          pricePerPerson={trip.basePrice}
          totalPrice={totalPrice}
          onPaymentClick={() => {}}
          onStripeTokenReceived={this.onStripeTokenReceived}
          paymentError={this.props.paymentError || this.state.paymentError}
        />
      </PaymentContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  paymentError: state.CheckoutReducer.paymentError,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectStripe(Payment));
