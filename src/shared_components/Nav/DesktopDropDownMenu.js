// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

// COMPONENTS
import Button from '../Button';
import { Image } from 'semantic-ui-react';
// COMMENT: the homeSearch is just for the time being
// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser, logOut } from 'scenes/sessions/actions';
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

  > div {
    margin-top: 5px;
  }
  > div:first-child {
    margin-right: 15px;
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
  height: 30px;
  width: 30px;
  margin-left: 15px;
  margin-top: -5px;
  order: 2;
`;

// MODULE
class DesktopDropDownMenu extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
  }

  logout = () => {
    this.props.logOut();
  };

  navigate_to = path => {
    history.push(path);
  };

  trigger = () => (
    <AvatarWrapper>
      <Image
        src={
          (this.props.session.profilePicture && this.props.session.profilePicture.url) ||
          this.props.session.metamaskPublicAddress ||
          ImgurAvatar
        }
        circular
        width={30}
        height={30}
      />
    </AvatarWrapper>
  );

  logged_out() {
    return (
      <Wrap>
        <Button
          type="link"
          theme={this.props.isBackgroundWhite ? 'textLightGreen' : 'whiteTransparent'}
          round
          size="small"
          href="/login"
        >
          Login
        </Button>
        <Button type="link" theme="mainFilled" round size="small" href="/register">
          Sign up
        </Button>
      </Wrap>
    );
  }

  logged_in() {
    const showAddServiceButton = window.location.hash !== '#/account/services'; //this.props.history && this.props.history.location.pathname !== "/account/services"

    return (
      <Wrap>
        {showAddServiceButton && (
          <Button type="link" theme="mainFilled" round size="small" href="/services/new">
            Add Service
          </Button>
        )}
        <Dropdown
          trigger={this.trigger()}
          direction="left"
          style={this.props.isBackgroundWhite ? { color: 'inherit' } : { color: 'white' }}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              icon="dollar"
              text="Earn Money"
              onClick={() => this.navigate_to('/earn-money')}
            />
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

const mapStateToProps = state => ({
  session: state.SessionsReducer.session,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getCurrentUser, logOut }, dispatch);
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DesktopDropDownMenu),
);
