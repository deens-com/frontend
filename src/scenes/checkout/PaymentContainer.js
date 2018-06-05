import React from 'react';
import { connect } from 'react-redux';

import PaymentSection from './components/PaymentSection';
import * as tripSelectors from '../trips/selectors';

class PaymentContainer extends React.Component {
  render() {
    const { price, trip } = this.props;
    const totalPrice = price * (trip.numberOfPerson || 1);
    return (
      <div>
        <PaymentSection pricePerPerson={price} totalPrice={totalPrice} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.TripsReducer.trip,
  price: tripSelectors.getTripTotalPrice(state),
});

export default connect(
  mapStateToProps,
  null
)(PaymentContainer);
