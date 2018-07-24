// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import Parse from 'parse';

// COMPONENTS

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import history from './../../main/history';

// STYLES
const Wrap = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 22;

  select {
    color: #6e7885;
    font-size: 24px;
    margin-bottom: 15px;
    padding: 12px 0;
  }
`;

const InnerList = styled.ul`
  background: white;
  height: 100%;
  list-style-type: none;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 95px 25px 25px;

  .Select,
  .Select div,
  .Select input,
  .Select span {
    font-size: 24px;
    color: #6e7885;
  }

  .Select-control {
    padding: 12px 0;
    margin-bottom: 15px;
  }

  .Select-placeholder,
  .Select--single > .Select-control .Select-value {
    padding: 12px 0;
  }

  .Select-menu-outer {
    top: 100%;
  }

  .flag-select {
    padding: 12px 0;
    width: 100%;

    .selected--flag--option {
      padding: 0;
    }

    .arrow-down {
      position: absolute;
      right: 8px;
      padding-right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }

    .flag-options {
      width: 100%;
    }
  }
`;

const NavLink = styled(Link)`
  display: block;
  font-size: 24px;
  margin-bottom: 15px;
  padding: 12px 0;

  &.is-active {
    color: #4fb798;
  }
`;

const LogoutLink = styled.a`
  display: block;
  font-size: 24px;
  margin-bottom: 15px;
  padding: 12px 0;
`;

const Divider = styled.hr`
  border: none;
  margin: 15px 0;
  height: 1px;
  background: #efeff0;
`;

// MODULE
export default class MobileNavProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
    };
  }

  componentDidMount() {
    if (Parse.User.current() === null) {
      this.setState({ logged_in: false });
    } else {
      this.setState({ logged_in: true });
    }
  }

  logout = () => {
    Parse.User.logOut().then(() => {
      this.setState({ logged_in: false });
      history.go('/');
    });
  };

  scrollDownMobileOnly = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth <= 750) {
      setTimeout(() => {
        window.scrollBy(0, 520);
      }, 20);
    }
  };

  render() {
    if (!this.props.menuIsOpened) return null;

    return (
      <Media
        query={`(max-width: ${sizes.large})`}
        render={() => (
          <Wrap>
            <InnerList>
              <li>
                <NavLink to="/account/trips/all" onClick={this.scrollDownMobileOnly}>
                  My Trips
                </NavLink>
              </li>
              <li>
                <NavLink to="/account/services" onClick={this.scrollDownMobileOnly}>
                  My Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/account/profile" onClick={this.scrollDownMobileOnly}>
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/account/settings" onClick={this.scrollDownMobileOnly}>
                  Settings
                </NavLink>
              </li>
              <li aria-hidden="true">
                <Divider />
              </li>
              <li>
                <LogoutLink onClick={this.logout}>Logout</LogoutLink>
              </li>
            </InnerList>
          </Wrap>
        )}
      />
    );
  }
}
