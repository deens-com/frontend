import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button } from 'semantic-ui-react';
import moment from 'moment';

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
    const { query } = this.props;
    return (
      <Modal open size="tiny" onClose={this.props.redirectToOwnedTrip}>
        <Header icon="warning sign" content="Some services are unavailable" />
        <Modal.Content>
          <Modal.Description>
            <p>
              Some of the services of your trip are unavailable on{' '}
              <strong>{moment(query.startDate).format('Do MMMM YYYY')}</strong> for{' '}
              <strong>
                {query.person.value} {query.person.value === '1' ? 'person' : 'people'}
              </strong>
              .
            </p>
            <p>
              You may continue booking the remaining available services by clicking on Book Now or
              you can change your search criteria
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
