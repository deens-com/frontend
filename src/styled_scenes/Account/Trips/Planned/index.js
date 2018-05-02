import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import { SectionWrap } from './../../../../shared_components/layout/Page';
import UserBasicInfo from './../../components/UserBasicInfo';
import {Link} from "react-router-dom";

const AccountTripsScene = props => {
  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <h2>My Trips</h2>
        <Link to="/account/trips/planned">Planned</Link>&nbsp; | &nbsp;
        <Link to="/account/trips/completed">Completed</Link>
      </Grid.Column>
    </Grid>
  );
};

export default AccountTripsScene;
