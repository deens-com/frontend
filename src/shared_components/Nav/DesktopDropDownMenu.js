// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fetch_helpers from './../../libs/fetch_helpers';
import Parse from 'parse';
// COMPONENTS
import Button from '../Button';
// COMMENT: the homeSearch is just for the time being
import { Image } from 'semantic-ui-react';

// ACTIONS/CONFIG
import { Dropdown } from 'semantic-ui-react';

import history from './../../main/history';
import ImgurAvatar from './../../assets/imgur-avatar.png';
// STYLES
const Wrap = styled.div`
  align-items: center;
  display: flex;
  padding-left: 15px;

  .Select-multi-value-wrapper {
    min-width: 37px;
  }

  > div:first-child {
    margin-right: 15px;
  }

  > div:nth-child(3) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const AvatarWrapper = styled.div`
  height: 30px;
  width: 30px;
`;

// MODULE
class DesktopDropDownMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      current_user: {},
    };
  }

  componentDidMount() {
    let user = Parse.User.current();
    if (user === null) {
      this.setState({ logged_in: false });
    } else {
      const json_user = fetch_helpers.normalizeParseResponseData(user);
      this.setState({ logged_in: true, current_user: json_user });
    }
  }

  logout = () => {
    Parse.User.logOut().then(() => {
      this.setState({ logged_in: false, current_user: {} });
      history.push('/');
    });
  };

  navigate_to = path => {
    history.push(path);
  };

  logged_out() {
    return (
      <Wrap>
        <Button type="link" theme="white" round size="small" href="/login">
          Login
        </Button>
        <Button type="link" theme="mainFilled" round size="small" href="/register">
          Sign up
        </Button>
      </Wrap>
    );
  }

  logged_in() {
    const dpUrl =
      (this.props.user_profile.profilePicture && this.props.user_profile.profilePicture.url) ||
      (this.state.current_user.profilePicture && this.state.current_user.profilePicture.url) ||
      ImgurAvatar;
    const showAddServiceButton = window.location.hash !== '#/account/services'; //this.props.history && this.props.history.location.pathname !== "/account/services"
    const truncatesUsername =
      this.state.current_user.username.length > 13
        ? this.state.current_user.username.substring(0, 11).concat('...')
        : this.state.current_user.username;
    return (
      <Wrap>
        {showAddServiceButton && (
          <Button type="link" theme="mainFilled" round size="small" href="/services/new">
            Add Service
          </Button>
        )}
        <AvatarWrapper>
          <Image src={dpUrl} circular onClick={() => this.navigate_to('/account/profile')} />
        </AvatarWrapper>
        <Dropdown
          direction="left"
          text={truncatesUsername}
          style={this.props.theme === 'light' ? { color: 'white' } : { color: 'inherit' }}
        >
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
            <Dropdown.Item
              icon="cogs"
              text="Settings"
              onClick={() => this.navigate_to('/account/settings')}
            />
            <Dropdown.Divider />
            <Dropdown.Item icon="power" text="Logout" onClick={this.logout} />
          </Dropdown.Menu>
        </Dropdown>
      </Wrap>
    );
  }

  render() {
    if (!this.state.logged_in) {
      return this.logged_out();
    } else {
      return this.logged_in();
    }
  }
}


const mapStateToProps = state => {
  return {
    user_profile: state.AccountReducer.user_profile
  };
};

export default withRouter(
  connect(
    mapStateToProps,
  )(DesktopDropDownMenu)
);
