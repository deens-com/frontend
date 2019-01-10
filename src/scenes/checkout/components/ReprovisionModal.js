import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

class ReprovisionModal extends Component {
  render() {
    return (
      <div>
        <Modal open closeOnEscape={false} closeOnDimmerClick={false} onClose={this.close}>
          <Modal.Header>Time out</Modal.Header>
          <Modal.Content>
            <p>
              Your time has expired. You can still continue booking but prices may change. Please
              check the price before paying.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.props.cancelClick} negative>
              Go back to trip organizer
            </Button>
            <Button
              onClick={this.props.okClick}
              positive
              labelPosition="right"
              icon="checkmark"
              content="Continue booking"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default ReprovisionModal;
