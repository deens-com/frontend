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

const CenteredDiv = styled.div`
  text-align: center;
`;

const NameDiv = styled.div`
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  font-size: 24px;
  font-weight: 600;
`;

const UserBasicInfo = props => {
  const { user } = props;
  if (!user) return null;
  return (
    <CenteredDiv>
      <CenteredDiv>
        <CircularProfilePic src="https://randomuser.me/api/portraits/men/41.jpg" size="96px" />
        <NameDiv>Jaydeep Solanki</NameDiv>
      </CenteredDiv>

      <Grid columns={2} divided>
        <Grid.Row>
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
    </CenteredDiv>
  );
};

UserBasicInfo.propTypes = {
  user: PropTypes.object,
};

export default UserBasicInfo;
