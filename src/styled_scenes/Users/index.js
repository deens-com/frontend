import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import UserBasicInfo from './components/UserBasicInfo';
import StatusAndBio from './components/StatusAndBio';
import UsersTrips from './components/UsersTrips';
import { SectionWrap } from '../../shared_components/layout/Page';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const UserScene = ({ user = {}, servicesAvailed, services }) => {
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
          <UsersTrips items={servicesAvailed} title={`Where I have been`} />
          <UsersTrips items={services} title={`My trips and services`} />
        </Grid.Column>
      </Grid>
    </Wrapper>
  );
};

UserScene.propTypes = {
  user: PropTypes.object,
  servicesAvailed: PropTypes.array,
  services: PropTypes.array,
};

export default UserScene;
