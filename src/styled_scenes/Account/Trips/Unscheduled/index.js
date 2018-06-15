import React from 'react';
import { Grid } from 'semantic-ui-react';
import { SectionWrap } from './../../../../shared_components/layout/Page';
import UserBasicInfo from './../../components/UserBasicInfo';
import { Link } from 'react-router-dom';

import TripSectionComponent from './../shared/TripSectionComponent';

const AccountTripsScene = props => {
  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <h1>My Trips</h1>
        <Link to="/account/trips/planned">Planned</Link>&nbsp; | &nbsp;
        <Link to="/account/trips/completed">Completed</Link>&nbsp; | &nbsp;
        <Link to="/account/trips/unscheduled" style={{ borderBottom: '2px solid #50a189' }}>
          Unscheduled
        </Link>
        <br />
        <br />
        <TripSectionComponent trips={props.unscheduled_trips} isServiceUnConfirmed={props.isServiceUnConfirmed} />
      </Grid.Column>
    </Grid>
  );
};

export default AccountTripsScene;
