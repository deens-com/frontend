import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import PreBookingPopup from '../components/PreBookingPopup';
import * as actions from '../actions';

class PreBookingPopupContainer extends React.Component {
  removeUnAvailableServices = () => {
    console.log('remove unvailable services and go ahead');
  };

  render() {
    const { preBookingStepResult, removePreBookingResults } = this.props;
    if (!preBookingStepResult) {
      return null;
    }
    return (
      <PreBookingPopup
        preBookingStepResult={preBookingStepResult}
        removePreBookingResults={removePreBookingResults}
        removeUnAvailableServices={this.removeUnAvailableServices}
      />
    );
  }
}

const mapStateToProps = state => ({
  preBookingStepResult: state.TripsReducer.preBookingStepResult,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PreBookingPopupContainer));
