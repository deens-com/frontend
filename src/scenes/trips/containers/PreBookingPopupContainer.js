import React from 'react';
import { connect } from 'react-redux';
import PreBookingPopup from '../components/PreBookingPopup';

class PreBookingPopupContainer extends React.Component {
  render() {
    const { preBookingStepResult } = this.props;
    if (!preBookingStepResult) {
      return null;
    }
    return <PreBookingPopup preBookingStepResult={preBookingStepResult} />;
  }
}

const mapStateToProps = state => ({
  preBookingStepResult: state.TripsReducer.preBookingStepResult,
});

export default connect(
  mapStateToProps,
  null
)(PreBookingPopupContainer);
