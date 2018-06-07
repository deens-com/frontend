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
            {/* TODO: replace the below YYYY-MM-DD & X with proper variables */}
            <p>Some of the services of your trip are unavailable on YYYY-MM-DD for X people.</p>
            <p>
              You may continue booking the remaining available services by clicking on Book Now or you can change your
              search criteria
            </p>
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
