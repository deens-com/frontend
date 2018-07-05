import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

export default class ChangeTripImageButton extends Component {
  static propTypes = {
    trip: PropTypes.object,
    isOwner: PropTypes.bool.isRequired,
    onImageSelect: PropTypes.func.isRequired,
  };

  onFileSelect = e => {
    const file = e.currentTarget.files[0];
    this.props.onImageSelect(file);
  };

  render() {
    const { trip, isOwner } = this.props;
    if (!trip || !isOwner) return null;
    return (
      <div>
        <input
          type="file"
          id="change-trip-image-btn-input"
          name="files"
          accept=".jpg, .jpeg, .png"
          hidden
          onChange={this.onFileSelect}
        />
        <Button icon labelPosition="left" as="label" for="change-trip-image-btn-input">
          <Icon name="camera" />
          Change Image
        </Button>
      </div>
    );
  }
}
