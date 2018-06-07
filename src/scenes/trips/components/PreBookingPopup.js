import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button } from 'semantic-ui-react';

class PreBookingPopup extends React.Component {
  static propTypes = {
    preBookingStepResult: PropTypes.object.isRequired,
    redirectToOwnedTrip: PropTypes.func.isRequired,
    removePreBookingResults: PropTypes.func.isRequired,
  };

  render() {
    // TODO: convert to functional component
    const { allAvailable } = this.props.preBookingStepResult;
    if (allAvailable) {
      // if all the services are available then no need to show this popup
      return null;
    }
    return (
      <Modal open size="tiny" onClose={this.props.redirectToOwnedTrip}>
        <Header icon="warning sign" content="Some services are unavailable" />
        <Modal.Content>
          <Modal.Description>
            <p>Some of the services are not available on your booking dates</p>
            <p>Change dates, move around services and change people count</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.props.redirectToOwnedTrip}
            labelPosition="right"
            icon="chevron right"
            content="OK"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default PreBookingPopup;
