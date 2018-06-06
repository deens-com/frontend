import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Icon, Button } from 'semantic-ui-react';

class PreBookingPopup extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    preBookingStepResult: PropTypes.object.isRequired,
    removePreBookingResults: PropTypes.func.isRequired,
    removeUnAvailableServices: PropTypes.func.isRequired,
  };

  renderNoAvailableServices = () => {
    return {
      title: 'No available services',
      description: (
        <React.Fragment>
          <p>None of the services are available on your booking dates with the given number of people</p>
        </React.Fragment>
      ),
      buttons: (
        <Modal.Actions>
          <Button color="blue" onClick={this.props.removePreBookingResults}>
            <Icon name="exchange" /> Change Dates
          </Button>
        </Modal.Actions>
      ),
      onClose: this.props.removePreBookingResults,
    };
  };

  renderSomeUnAvailableServices = () => {
    return {
      title: 'Some services are unavailable',
      description: (
        <React.Fragment>
          <p>Some of the services are not available on your booking dates</p>
        </React.Fragment>
      ),
      buttons: (
        <Modal.Actions>
          <Button color="red" onClick={this.props.removeUnAvailableServices}>
            <Icon name="remove" /> Remove Unavailable Services
          </Button>
          <Button color="blue" onClick={this.props.removePreBookingResults}>
            <Icon name="exchange" /> Change Dates
          </Button>
        </Modal.Actions>
      ),
      onClose: this.props.removePreBookingResults,
    };
  };

  render() {
    const { allAvailable, allUnavailable } = this.props.preBookingStepResult;
    if (allAvailable) {
      // if all the services are available then no need to show this popup
      return null;
    }
    const renderFunction = allUnavailable ? this.renderNoAvailableServices : this.renderSomeUnAvailableServices;
    const { title, description, buttons, onClose } = renderFunction();

    return (
      <Modal open size="tiny" onClose={onClose}>
        <Header icon="warning sign" content={title} />
        <Modal.Content>
          <Modal.Description>
            {/* <Header>{title}</Header> */}
            {description}
          </Modal.Description>
        </Modal.Content>
        {buttons}
      </Modal>
    );
  }
}

export default PreBookingPopup;
