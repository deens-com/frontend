import React from 'react';
import PropTypes from 'prop-types';
import { Container, Dropdown, Grid,  Input } from 'semantic-ui-react';
import Media from 'react-media';

import { sizes } from '../../../libs/styled';

const dropDownOptions = [
  {
    key: 'public',
    text: 'Public',
    value: 'public',
  },
  {
    key: 'unlisted',
    text: 'Unlisted',
    value: 'unlisted',
  },
  {
    key: 'private',
    text: 'Private',
    value: 'private',
  },
];

const getDropDown = isDesktop => (
  <Dropdown
    selection
    compact={!isDesktop}
    placeholder="Select Visibility"
    defaultValue="public"
    options={dropDownOptions}
  />
);

const ShareDialogContent = ({ trip }) => {
  const tripUrl = `${window.location.origin}/#/trips/${trip.objectId}`;
  return (
    <Container>
      <Grid columns="2">
        <Grid.Row>
          <Grid.Column verticalAlign="middle">
            <h3>Visibility</h3>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Media query={`(min-width: ${sizes.large})`}>{matches => getDropDown(matches)}</Media>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width="16">
            <Input
              action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy' }}
              fluid
              value={tripUrl}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

ShareDialogContent.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default ShareDialogContent;
