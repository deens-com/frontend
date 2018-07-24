import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Parse from 'parse';

import * as tripActions from '../trips/actions';
import CheckoutScene from './CheckoutScene';

/**
 * The job of this Container is the fetch all the required by CheckoutScene
 * and store it in the Redux Store
 *
 * It's responsibility is NOT to pass all the data down to the exact component which requires it
 */
class CheckoutContainer extends Component {
  getTripId = () => this.props.match && this.props.match.params && this.props.match.params.id;

  componentDidMount() {
    const tripId = this.getTripId();
    this.props.fetchTrip(tripId);
  }

  render() {
    const { tripError } = this.props;
    const isNotFound = !!(tripError && tripError.code === Parse.Error.OBJECT_NOT_FOUND);
    return <CheckoutScene notFound={isNotFound} />;
  }
}

const mapStateToProps = state => ({
  tripError: state.TripsReducer.tripError,
});

const mapDispatchToProps = dispatch => bindActionCreators(tripActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(CheckoutContainer));
