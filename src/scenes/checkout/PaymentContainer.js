import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button } from 'semantic-ui-react';

import PaymentSection from './components/PaymentSection';
import * as actions from './actions';
import { statuses } from '../../libs/fetch_helpers';
import StripeAutoPaymentButton from './components/StripeAutoPaymentButton';

class PaymentContainer extends React.Component {
  componentDidMount() {
    this.props.clearTripBooked();
  }

  render() {
    const { trip, markTripBooked, isLoading } = this.props;
    const totalPrice = trip.price * (trip.numberOfPerson || 1);
    return (
      <div>
        <PaymentSection
          numberOfPerson={trip.numberOfPerson}
          pricePerPerson={trip.price}
          totalPrice={totalPrice}
          onPaymentClick={markTripBooked}
          isLoading={isLoading}
        />
        <div className="checkout">
          <StripeAutoPaymentButton currency="usd" amount={100} />
          Or enter your payment details below
          <CardElement />
          <Button>Pay $1</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.TripsReducer.trip,
  isLoading: state.TripsReducer.bookingStatus === statuses.STARTED,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectStripe(PaymentContainer));
