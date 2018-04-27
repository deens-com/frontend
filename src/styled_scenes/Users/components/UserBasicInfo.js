import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Icon } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import CircularProfilePic from './CircularProfilePic';

const BodyText = styled.p`
  font-weight: 500;
`;
const AttributeTitle = styled.h6`
  font-size: 9px;
  color: #a3a9b2;
`;

const UserBasicInfo = props => {
  const { user } = props;
  if (!user) return null;
  return (
    <Grid divided="vertically" centered>
      <Grid.Row columns={1} centered>
        <Grid.Column textAlign="centered">
          <div>
            <CircularProfilePic src="https://randomuser.me/api/portraits/men/41.jpg" size="96px" />
            <h2>Jaydeep Solanki</h2>
          </div>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns={2}>
        <Grid.Column textAlign="centered">
          <div>
            <AttributeTitle>MEMBER SINCE</AttributeTitle>
            <BodyText>July 2016</BodyText>
          </div>
        </Grid.Column>
        <Grid.Column textAlign="centered">
          <div>
            <AttributeTitle>USER LEVEL</AttributeTitle>
            <BodyText>
              <Icon fitted name="star" style={{ color: '#4fb798' }} /> SuperHero
            </BodyText>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

UserBasicInfo.propTypes = {
  user: PropTypes.object,
};

export default UserBasicInfo;
