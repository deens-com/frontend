import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const SaveButton = ({ showTripUpdated }) =>
  showTripUpdated ? (
    <Button icon color="green" type="submit" labelPosition="right">
      Saved
      <Icon name="check circle outline" />
    </Button>
  ) : (
    <Button type="submit">Save</Button>
  );

const ToolbarButton = ({ showSaveButton, showTripUpdated }) =>
  showSaveButton ? <SaveButton showTripUpdated={showTripUpdated} /> : <Button type="submit">Check Availibility</Button>;

ToolbarButton.propTypes = {
  showSaveButton: PropTypes.bool,
  showTripUpdated: PropTypes.bool,
};

export default ToolbarButton;
