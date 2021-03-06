import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PaymentSection from './PaymentSection';
import * as actions from 'store/checkout/actions';

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

  payWithPls = async (guests, tripId) => {
    this.props.startPayment();
    this.setState({ isPaymentProcessing: true, paymentError: null });
    try {
      const status = await this.props.payWithPls(guests, tripId);
      this.setState({ isPaymentProcessing: false });
      this.props.finishPayment();
      if (status === 'success') {
        this.props.nextStep();
      }
    } catch (e) {
      this.props.finishPayment();
      this.setState({
        isPaymentProcessing: false,
        paymentError: e,
      });
    }
  };

  onPayWithCreditCard = async () => {
    this.props.startPayment();
    this.setState({ isPaymentProcessing: true, paymentError: null });
    try {
      await this.props.chargeStripeToken(this.props.guests, this.props.stripe);
      this.setState({ isPaymentProcessing: false });
      this.props.finishPayment();
    } catch (error) {
      this.props.finishPayment();
      this.setState({
        isPaymentProcessing: false,
        paymentError: error,
      });
    }
  };

  render() {
    const { trip, error, getProvisionCodes } = this.props;
    if (!trip || !trip._id) return null;
    const pricePerPerson = trip.bookablePrice / (trip.numberOfPerson || 1);
    return (
      <PaymentContext.Provider
        value={{
          totalPrice: trip.bookablePrice,
          ...this.state,
        }}
      >
        <PaymentSection
          trip={trip}
          numberOfPerson={trip.adultCount + trip.childrenCount + trip.infantCount}
          pricePerPerson={pricePerPerson}
          totalPrice={trip.bookablePrice}
          onPaymentClick={() => {}}
          paymentError={this.props.paymentError || this.state.paymentError}
          guests={this.props.guests}
          showStripe={Boolean(this.props.stripe)}
          error={error}
          getProvisionCodes={getProvisionCodes}
          onPayWithCreditCard={this.onPayWithCreditCard}
          payWithPls={this.payWithPls}
          bookingStatus={this.props.bookingStatus}
          isPaymentProcessing={this.state.isPaymentProcessing}
          plsBalance={this.props.plsBalance}
        />
      </PaymentContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  paymentError: state.checkout.paymentError,
  bookingStatus: state.checkout.bookingStatus,
  plsBalance: state.session.session.plsBalance || 0,
  username: state.session.session.username,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment);
