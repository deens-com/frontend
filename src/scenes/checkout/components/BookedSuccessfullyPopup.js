import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { tripBookingStatuses } from '../actions';

class BookedSuccessfullyPopup extends React.Component {
  onClose = () => {
    this.props.history.push('/account/trips/planned');
  };

  render() {
    const { bookingStatus } = this.props;
    const show = bookingStatus === tripBookingStatuses.SUCCESS;
    return (
      <Modal centered={false} open={show} onClose={this.onClose}>
        <Modal.Header>Booked Successifully</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Icon name="check circle outline" />
            <h2>Thanks for booking</h2>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  bookingStatus: state.TripsReducer.bookingStatus,
});

export default connect(
  mapStateToProps,
  null
)(withRouter(BookedSuccessfullyPopup));
