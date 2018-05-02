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

const UserScene = ({
  user = {},
  tripsBooked = [],
  tripsAndServicesOffered = [],
  givenReviews = [],
  receivedReviews = [],
}) => {
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
          {tripsBooked.length > 0 && <UsersTripsServices items={tripsBooked} title="Where I have been" />}
          {tripsAndServicesOffered.length > 0 && (
            <UsersTripsServices items={tripsAndServicesOffered} title="My trips and services" />
          )}
          {givenReviews.length > 0 && <Reviews title="Reviews I have given" reviews={givenReviews} />}
          {receivedReviews.length > 0 && <Reviews title="Reviews I have received" reviews={receivedReviews} />}
        </Grid.Column>
      </Grid>
    </Wrapper>
  );
};

UserScene.propTypes = {
  user: PropTypes.object,
  tripsBooked: PropTypes.array,
  tripsAndServicesOffered: PropTypes.array,
  givenReviews: PropTypes.array,
  receivedReviews: PropTypes.array,
};

export default UserScene;
