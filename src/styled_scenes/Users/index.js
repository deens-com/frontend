import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import UserBasicInfo from './components/UserBasicInfo';
import StatusAndBio from './components/StatusAndBio';
import UsersTripsServices from './components/UsersTripsServices';
import { SectionWrap } from '../../shared_components/layout/Page';
import Reviews from './components/Reviews';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const UserScene = ({ user = {}, servicesAvailed, tripsAndServicesOffered, givenReviews, receivedReviews }) => {
  return (
    <Wrapper>
      <Grid centered columns={2}>
        <Grid.Column mobile={16} tablet={5} computer={4}>
          <SectionWrap>
            <UserBasicInfo user={user} />
          </SectionWrap>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={11} computer={12}>
          <StatusAndBio user={user} />
          <UsersTripsServices items={servicesAvailed} title="Where I have been" />
          <UsersTripsServices items={tripsAndServicesOffered} title="My trips and services" />
          <Reviews title="Reviews I have given" reviews={givenReviews} />
          <Reviews title="Reviews I have received" reviews={receivedReviews} />
        </Grid.Column>
      </Grid>
    </Wrapper>
  );
};

UserScene.propTypes = {
  user: PropTypes.object,
  servicesAvailed: PropTypes.array,
  tripsAndServicesOffered: PropTypes.array,
  givenReviews: PropTypes.array,
  receivedReviews: PropTypes.array,
};

export default UserScene;
