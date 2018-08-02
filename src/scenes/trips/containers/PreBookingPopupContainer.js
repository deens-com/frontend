import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import PreBookingPopup from '../components/PreBookingPopup';
import * as actions from '../actions';

class PreBookingPopupContainer extends React.Component {
  componentDidMount() {
    this.props.removePreBookingResults();
  }

  redirectToOwnedTrip = () => {
    const { preBookingStepResult, history } = this.props;
    history.push(`/trips/${preBookingStepResult.newTripId}/edit`);
    this.props.removePreBookingResults();
  };

  render() {
    const { preBookingStepResult } = this.props;
    if (!preBookingStepResult) {
      return null;
    }
    return <PreBookingPopup {...this.props} redirectToOwnedTrip={this.redirectToOwnedTrip} />;
  }
}

const mapStateToProps = state => ({
  preBookingStepResult: state.TripsReducer.preBookingStepResult,
  query: state.TripsReducer.query,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(PreBookingPopupContainer));
