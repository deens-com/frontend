import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import ShareDialogContent from './ShareDialogContent';
import Button from '../../../shared_components/Button';

const ShareButton = ({ trip, updateTripDetails, showTripStatusChanged, onShareModalClose }) => {
  if (!trip) return null;
  return (
    <Modal
      size="tiny"
      trigger={<Button type="button" text="Share the trip" />}
      closeIcon
      onClose={onShareModalClose}
    >
      <Modal.Header>Share this Trip</Modal.Header>
      <Modal.Content>
        <ShareDialogContent
          trip={trip}
          updateTripDetails={updateTripDetails}
          showTripStatusChanged={showTripStatusChanged}
        />
      </Modal.Content>
    </Modal>
  );
};

ShareButton.propTypes = {
  trip: PropTypes.object,
  updateTripDetails: PropTypes.func.isRequired,
  showTripStatusChanged: PropTypes.bool.isRequired,
  onShareModalClose: PropTypes.func.isRequired,
};

export default ShareButton;
