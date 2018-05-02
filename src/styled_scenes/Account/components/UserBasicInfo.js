import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Icon } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import CircularProfilePic from './CircularProfilePic';
import moment from "moment";
import Stars from './Stars';
import { Link } from "react-router-dom";
import { Input, Label, Menu, Card } from 'semantic-ui-react';

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

const Wrapper = styled.div`
  text-align: center;
  padding: 30px 20px 30px 20px;
`;

const NameDiv = styled.div`
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  font-size: 24px;
  font-weight: 600;
`;

const CenteredMenu = styled.div`
  display: inline-flex;
`;

const formatDate = date => moment(date).format('MMMM YYYY');

const UserBasicInfo = ({ user_profile: user = {}, match }) => {
  const name = user.fullName || user.username;
  const dpUrl = (user.profilePicture && user.profilePicture.url) || '"https://dummyimage.com/600x400/000/fff"';
  let activePath = match.path.replace("/account/", "");
  return (
    <Card>
      <Wrapper>
        <CenteredDiv>
          <CircularProfilePic src={dpUrl} />
          {name && <NameDiv>{name}</NameDiv>}
        </CenteredDiv>

        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <div>
                <AttributeTitle>PLS Balance</AttributeTitle>
                {user.plsBalance}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <div>
                <AttributeTitle>RATING</AttributeTitle>
                <Stars rating={user.rating} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <CenteredMenu>
        <br/>
          <Menu vertical>
            <Menu.Item name='trips' active={activePath === 'trips'}>
              <Link to="/account/trips">My Trips</Link>
            </Menu.Item>

            <Menu.Item name='services' active={activePath === 'services'}>
              <Link to="/account/services">My Listing</Link>
            </Menu.Item>

            <Menu.Item name='updates' active={activePath === 'profile'}>
              <Link to="/account/profile">Public Profile</Link>
            </Menu.Item>

            <Menu.Item name='updates' active={activePath === 'settings'}>
              <Link to="/account/settings">Settings</Link>
            </Menu.Item>
          </Menu>
        </CenteredMenu>
      </Wrapper>
    </Card>
  );
};

UserBasicInfo.propTypes = {
  user: PropTypes.object,
};

export default UserBasicInfo;
