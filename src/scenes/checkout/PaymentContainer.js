import React from 'react';
import { connect } from 'react-redux';

import PaymentSection from './components/PaymentSection';
import * as tripSelectors from '../trips/selectors';

class PaymentContainer extends React.Component {
  render() {
    const { price } = this.props;
    return (
      <div>
        <PaymentSection price={price} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  price: tripSelectors.getTripTotalPrice(state),
});

export default connect(mapStateToProps, null)(PaymentContainer);
