// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

// COMPONENTS
import Button from '../Button';
import { Image } from 'semantic-ui-react';
// COMMENT: the homeSearch is just for the time being
// ACTIONS/CONFIG
import { Dropdown } from 'semantic-ui-react';

import { PStrong } from 'libs/commonStyles';

import history from './../../main/history';
import ImgurAvatar from './../../assets/no-avatar.png';
// STYLES
const Wrap = styled.div`
  align-items: center;
  display: flex;
  .Select-multi-value-wrapper {
    min-width: 37px;
  }

  > div {
    margin-top: 5px;
  }
  > div:nth-child(3) {
    margin-left: 15px;
    margin-right: 15px;
  }

  a {
    font-size: 14px;
  }

  > div > i {
    order: 1;
  }

  .dropdown {
    display: flex;
  }
`;

const AvatarWrapper = styled.div`
  height: 38px;
  width: 38px;
  border-radius: 10px 10px 10px 0;
  overflow: hidden;
  margin-left: 15px;
  margin-top: -5px;
  order: 2;
`;

// MODULE
export default class DesktopDropDownMenu extends Component {
  logout = () => {
    this.props.logOut();
  };

  navigate_to = path => {
    history.push(path);
  };

  trigger = () => (
    <AvatarWrapper>
      <Image src={this.props.session.profilePicture || ImgurAvatar} width={38} height={38} />
    </AvatarWrapper>
  );

  logged_out() {
    return (
      <Wrap>
        <Button
          type="link"
          theme="primaryFilled"
          size="small"
          href="/login"
          borderRadius="5px 0 0 0"
        >
          Login
        </Button>
        <Button borderRadius="0 5px 5px 0" type="link" size="small" href="/register">
          Sign up
        </Button>
      </Wrap>
    );
  }

  logged_in() {
    return (
      <Wrap>
        <Button type="link" theme="primaryFilled" size="small" href="/trips/create">
          <PStrong>Create Trip</PStrong>
        </Button>
        <Dropdown trigger={this.trigger()} icon={null}>
          <Dropdown.Menu>
            <Dropdown.Item
              icon="plane"
              text="My Trips"
              onClick={() => this.navigate_to('/account/trips/all')}
            />
            <Dropdown.Item
              icon="list"
              text="My Services"
              onClick={() => this.navigate_to('/account/services')}
            />
            <Dropdown.Item
              icon="user"
              text="Profile"
              onClick={() => this.navigate_to('/account/profile')}
            />
            {/*<Dropdown.Item
              icon="cogs"
              text="Settings"
              onClick={() => this.navigate_to('/account/settings')}
            />*/}
            <Dropdown.Divider />
            <Dropdown.Item icon="power" text="Logout" onClick={this.logout} />
          </Dropdown.Menu>
        </Dropdown>
      </Wrap>
    );
  }

  render() {
    if (this.props.session.username) {
      return this.logged_in();
    } else {
      return this.logged_out();
    }
  }
}
