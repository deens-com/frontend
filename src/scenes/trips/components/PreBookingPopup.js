import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';

class PreBookingPopup extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    preBookingStepResult: PropTypes.object.isRequired,
  };

  renderNoAvailableServices() {
    return {
      title: 'No available services',
      description: (
        <React.Fragment>
          <p>None of the services are available on your booking dates with the given number of people</p>
        </React.Fragment>
      ),
    };
  }

  renderSomeUnAvailableServices() {
    return {
      title: 'Some services are unavailable',
      description: (
        <React.Fragment>
          <p>Some of the services are not available on your booking dates</p>
        </React.Fragment>
      ),
    };
  }

  render() {
    const { allAvailable, allUnavailable } = this.props.preBookingStepResult;
    if (allAvailable) {
      // if all the services are available then no need to show this popup
      return null;
    }
    const renderFunction = allUnavailable ? this.renderNoAvailableServices : this.renderSomeUnAvailableServices;
    const { title, description } = renderFunction();

    return (
      <Modal open>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {/* <Header>{title}</Header> */}
            {description}
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default PreBookingPopup;
