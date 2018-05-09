import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import { SectionWrap } from './../../../../shared_components/layout/Page';
import UserBasicInfo from './../../components/UserBasicInfo';
import {Link} from "react-router-dom";
import {SectionContent} from "./../../../../shared_components/layout/Page";
import Carousel from "./../../../../shared_components/Carousel";
import LocationCart from "./../../../../shared_components/Carts/Location";
import moment from "moment";
import uuid from 'uuid/v1';
import { Divider, Label } from 'semantic-ui-react';

import TripSectionComponent from "./../shared/TripSectionComponent";

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
        <Link to="/account/trips/completed" style={{borderBottom: "2px solid #50a189"}}>Completed</Link>

        <br/><br/>

        <TripSectionComponent trips={props.completed_trips} />

      </Grid.Column>
    </Grid>
  );
};

export default AccountTripsScene;
