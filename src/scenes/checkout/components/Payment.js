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

class PaymentContainer extends React.Component {
  onStripeTokenReceived = (token, complete) => {
    this.props.chargeStripeToken(token, this.props.guests, complete);
  };

  onSubmitWithCardDetails = async () => {
    this.setState({ isPaymentProcessing: true });
    try {
      // TODO: @jaydp use the customer's name in the below line
      const { token, error } = await this.props.stripe.createToken({ name: 'Customer name' });
      if (error) {
        this.props.setPaymentError(error);
        this.setState({ isPaymentProcessing: false });
        return;
      }
      this.onStripeTokenReceived(token, () => this.setState({ isPaymentProcessing: false }));
    } catch (error) {
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
          paymentError={this.props.paymentError}
        />
      </PaymentContext.Provider>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(injectStripe(PaymentContainer));
