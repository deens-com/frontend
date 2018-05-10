import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Icon } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import CircularProfilePic from './CircularProfilePic';
import moment from "moment";
import Stars from './Stars';
import { Link } from "react-router-dom";
import { Input, Label, Menu, Card } from 'semantic-ui-react';
import Parse from "parse";
import history from "./../../../main/history";

const BodyText = styled.p`
  font-weight: 500;
`;
const AttributeTitle = styled.h6`
  font-size: 9px;
  color: #a3a9b2;
`;

const CenteredDiv = styled.div`
  //text-align: center;
`;

const Wrapper = styled.div`
  //text-align: center;
  padding: 30px 0px 30px 0px;
`;

const NameDiv = styled.div`
  text-align: center;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  font-size: 24px;
  font-weight: 600;
`;

const CenteredMenu = styled.div`
  display: inline-flex;
`;

const MenuIcon = styled(Icon)`
  color: #5fb79e;
`;

const formatDate = date => moment(date).format('MMMM YYYY');

const UserBasicInfo = ({ user_profile: user = {}, match }) => {
  const name = user.fullName || user.username;
  const dpUrl = (user.profilePicture && user.profilePicture.url) || "https://s3.amazonaws.com/prod.tracker2/resource/89015825/anonymous.png?response-content-disposition=inline&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJJBSFJ4TCVKKGAIA%2F20180503%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180503T101317Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=f735a25f3940c2226e125d464316bd95ce3225eed0702c408b465bd074cbcef6";
  let activePath = match.path.replace("/account/", "");
  const logout = () => {
    Parse.User.logOut().then(() => {
      history.push("/");
    });
  }
  return (
    <Card>
      <Wrapper>
        <CenteredDiv>
          <Link to={"/users/" + user.username}>
            <CircularProfilePic src={dpUrl} />
            {name && <NameDiv>{name}</NameDiv>}
          </Link>
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

        <br/>

        <Menu secondary fluid vertical style={{paddingLeft: "10px"}}>

          <Link to="/account/trips/planned">
            <Menu.Item name='trips' active={activePath === 'trips'}>
              <MenuIcon disabled name='angle right' circular />
              <span>
                <MenuIcon disabled name='plane' circular />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                My Trips
              </span>
            </Menu.Item>
          </Link>

          <Link to="/account/services">
            <Menu.Item name='services' active={activePath === 'services'}>
              <MenuIcon disabled name='angle right' circular />
              <span>
                <MenuIcon disabled name='list' circular />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                My Services
              </span>
            </Menu.Item>
          </Link>

          <Link to="/account/profile">
            <Menu.Item name='profile' active={activePath === 'profile'}>
              <MenuIcon disabled name='angle right' circular />
              <span>
                <MenuIcon disabled name='user' circular />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Profile
              </span>
            </Menu.Item>
          </Link>

          <Link to="/account/settings">
            <Menu.Item name='settings' active={activePath === 'settings'}>
              <MenuIcon disabled name='angle right' circular />
              <span>
                <MenuIcon disabled name='cogs' circular />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Settings
              </span>
            </Menu.Item>
          </Link>

          <div style={{cursor: "pointer"}} onClick={logout}>
            <Menu.Item name='logout' active={activePath === 'logout'}>
              <MenuIcon disabled name='angle right' circular />
              <span>
                <MenuIcon disabled name='power' circular />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Logout
              </span>
            </Menu.Item>
          </div>

        </Menu>

      </Wrapper>
    </Card>
  );
};

export default UserBasicInfo;
