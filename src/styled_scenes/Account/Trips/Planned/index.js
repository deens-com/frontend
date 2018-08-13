import React from 'react';
import { Grid } from 'semantic-ui-react';
import { SectionWrap } from './../../../../shared_components/layout/Page';
import UserBasicInfo from './../../components/UserBasicInfo';
import { Link } from 'react-router-dom';

import TripSectionComponent from './../shared/TripSectionComponent';
import { scrollDownMobileOnly } from './../shared/scrollDownMobileOnly';

const AccountTripsScene = props => {
  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} x computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <h1>My Trips</h1>
        <Link to="/account/trips/all" onClick={scrollDownMobileOnly}>
          All
        </Link>&nbsp; | &nbsp;
        <Link
          to="/account/trips/planned"
          onClick={scrollDownMobileOnly}
          style={{ borderBottom: '2px solid #50a189' }}
        >
          Planned
        </Link>&nbsp; | &nbsp;
        <Link onClick={scrollDownMobileOnly} to="/account/trips/completed">
          Completed
        </Link>
        <br />
        <br />
        <TripSectionComponent trips={props.planned_trips} tripsType="planned" />
      </Grid.Column>
    </Grid>
  );
};

export default AccountTripsScene;
