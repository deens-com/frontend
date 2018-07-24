import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PaymentSection from './components/PaymentSection';
import * as actions from './actions';
import { statuses } from '../../libs/fetch_helpers';

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
)(PaymentContainer);
