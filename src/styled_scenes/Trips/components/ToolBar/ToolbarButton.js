import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const ToolbarButton = ({ showSaveButton, onCheckAvailibilityClick, serviceAvailabilityCheckInProgress }) =>
  showSaveButton ? null : (
    <Button type="button" onClick={onCheckAvailibilityClick} loading={serviceAvailabilityCheckInProgress}>
      Check availability
    </Button>
  );

ToolbarButton.propTypes = {
  showSaveButton: PropTypes.bool,
  showTripUpdated: PropTypes.bool,
  onCheckAvailibilityClick: PropTypes.func.isRequired,
  serviceAvailabilityCheckInProgress: PropTypes.bool.isRequired,
};

export default ToolbarButton;
