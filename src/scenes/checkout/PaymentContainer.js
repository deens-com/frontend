import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PaymentSection from './components/PaymentSection';
import * as tripSelectors from '../trips/selectors';
import * as actions from './actions';

class PaymentContainer extends React.Component {
  render() {
    // TODO: convert to a functional component
    const { price, trip, markTripBooked } = this.props;
    const totalPrice = price * (trip.numberOfPerson || 1);
    return (
      <div>
        <PaymentSection pricePerPerson={price} totalPrice={totalPrice} onPaymentClick={markTripBooked} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.TripsReducer.trip,
  price: tripSelectors.getTripTotalPrice(state),
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentContainer);
