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
  constructor(props) {
    super(props);
  }

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
    const { trip, markTripBooked, isLoading } = this.props;
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
          numberOfPerson={trip.numberOfPerson}
          pricePerPerson={trip.basePrice}
          totalPrice={totalPrice}
          onPaymentClick={markTripBooked}
          isLoading={isLoading}
          onStripeTokenReceived={this.onStripeTokenReceived}
          paymentError={this.props.paymentError}
        />
      </PaymentContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.TripReducer.trip,
  isLoading: state.TripReducer.isLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectStripe(PaymentContainer));
