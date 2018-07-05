import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const ChangeTripImageButton = ({ trip, isOwner, onImageSelect }) => {
  if (!trip || !isOwner) return null;
  return (
    <Button icon labelPosition="left">
      <Icon name="camera" />
      Change Image
    </Button>
  );
};

ChangeTripImageButton.propTypes = {
  trip: PropTypes.object,
  isOwner: PropTypes.bool.isRequired,
};

export default ChangeTripImageButton;
