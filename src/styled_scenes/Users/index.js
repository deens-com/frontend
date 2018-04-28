import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import UserBasicInfo from './components/UserBasicInfo';
import StatusAndBio from './components/StatusAndBio';

const UserScene = props => {
  return (
    <Grid centered columns={2}>
      <Grid.Column width={4}>
        <UserBasicInfo {...props} />
      </Grid.Column>
      <Grid.Column width={12}>
        <StatusAndBio {...props} />
      </Grid.Column>
    </Grid>
  );
};

UserScene.propTypes = {
  user: PropTypes.object,
};

export default UserScene;
