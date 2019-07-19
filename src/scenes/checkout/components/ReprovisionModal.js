import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

// i18n
import { I18n } from '@lingui/react';
import { Trans } from '@lingui/macro';

class ReprovisionModal extends Component {
  render() {
    return (
      <div>
        <Modal open closeOnEscape={false} closeOnDimmerClick={false} onClose={this.close}>
          <Modal.Header>
            <Trans>Time out</Trans>
          </Modal.Header>
          <Modal.Content>
            <p>
              <Trans>
                Your time has expired. You can still continue booking but prices may change. Please
                check the price before paying.
              </Trans>
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.props.cancelClick} negative>
              <Trans>Go back to your trip</Trans>
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
