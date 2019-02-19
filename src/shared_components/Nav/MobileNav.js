// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import { connect } from 'react-redux';

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import { mainNav } from '../../data/nav';
import Button from '../Button';
import { Briefcase, Folder, AccountCircle, Settings } from '../icons';
import { getSession } from 'libs/user-session';
import { trackHeaderClick } from 'libs/analytics';
import { bindActionCreators } from 'redux';
import { logOut } from 'store/session/actions';
import { icoReady } from 'libs/config';

// STYLES
const Wrap = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 20;

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
  padding: 55px 25px 25px;

  .Select,
  .Select div,
  .Select input,
  .Select span {
    font-size: 24px;
    color: #6e7885;
  }

  .Select-control {
    padding: 10px 0;
  }

  @media screen and (max-width: 768px) {
    .Select,
    .Select div,
    .Select input,
    .Select span {
      font-size: 14px;
      padding: 4px;
    }

    .Select-control {
      margin-bottom: 0;
    }
  }

  .Select-placeholder,
  .Select--single > .Select-control .Select-value {
    padding: 10px 0;
  }

  .Select-menu-outer {
    top: 100%;
  }

  .flag-select {
    padding: 10px 0;
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

const NavLinkTitle = styled.span`
  display: flex;
  font-size: 16px;
  padding: 10px 0;
  font-weight: bold;
`;

const NavLink = styled(Link)`
  display: flex;
  font-size: 24px;
  padding: 10px 0;
  align-items: center;

  &.is-active {
    color: #4fb798;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    padding: 4px;
  }
  svg {
    margin-right: 20px;
  }
`;

const NavAnchor = styled.a`
  display: flex;
  font-size: 24px;
  padding: 10px 0;
  align-items: center;

  &.is-active {
    color: #4fb798;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    padding: 4px;
  }
  svg {
    margin-right: 20px;
  }
`;

const Divider = styled.hr`
  border: none;
  margin: 15px 0;
  height: 1px;
  background: #efeff0;
`;

const LoggedInItem = styled.li`
  font-weight: bold;
`;

const SessionButtons = styled.li`
  display: flex;
  align-items: center;
  flex-direction: column;
  > div {
    margin-bottom: 14px;
  }
`;

// MODULE
class MobileNav extends Component {
  componentDidMount() {
    try {
      const session = getSession();
      if (session) {
        this.setState({ logged_in: true });
      } else {
        this.setState({ logged_in: false });
      }
    } catch (error) {
      this.setState({ logged_in: false });
    }
  }

  logout = () => {
    this.props.logOut();
    this.props.toggleMenu();
  };

  renderSessionButtons() {
    if (this.state.logged_in) {
      return (
        <Button theme="textLightGreen" size="medium" onClick={this.logout}>
          Log out
        </Button>
      );
    }
    return (
      <React.Fragment>
        <Button type="link" href="/register" size="medium">
          Sign up
        </Button>
        <Button type="link" href="/login" theme="textLightGreen" size="medium">
          Login
        </Button>
      </React.Fragment>
    );
  }

  renderLoggedInMenu = () => {
    if (!this.state.logged_in) {
      return null;
    }
    return (
      <React.Fragment>
        <Divider />
        <LoggedInItem>
          <NavLink to="/account/trips/all">
            <Briefcase />
            My Trips
          </NavLink>
        </LoggedInItem>
        <LoggedInItem>
          <NavLink to="/account/services">
            <Folder />
            My Services
          </NavLink>
        </LoggedInItem>
        <LoggedInItem>
          <NavLink to="/account/profile">
            <AccountCircle />
            Profile
          </NavLink>
        </LoggedInItem>
        <LoggedInItem>
          <NavLink to="/account/settings">
            <Settings />
            Settings
          </NavLink>
        </LoggedInItem>
        <Divider />
      </React.Fragment>
    );
  };

  render() {
    if (!this.props.showProfileMenu) return null;
    const { analytics } = this.props;
    console.log(icoReady);
    return (
      <Media
        query={`(max-width: ${sizes.large})`}
        render={() => (
          <Wrap>
            <InnerList>
              <li aria-hidden="true">
                <Divider />
              </li>
              {icoReady && (
                <li aria-hidden="false">
                  <NavLinkTitle>Token Sale</NavLinkTitle>
                  <NavAnchor href="https://protocol.please.com">Information</NavAnchor>
                  <NavLink to="/token-sale">Contribute</NavLink>
                </li>
              )}
              {this.renderLoggedInMenu()}
              <li aria-hidden="false">
                <NavLink to="/">Home</NavLink>
              </li>
              <li aria-hidden="false">
                <NavLink onClick={() => analytics(trackHeaderClick('Earn Money'))} to="/">
                  Earn Money
                </NavLink>
              </li>
              <li aria-hidden="true">
                <Divider />
              </li>
              {mainNav.map(item => (
                <li aria-hidden="false" key={item.label} onClick={this.props.toggleMenu}>
                  <NavLink
                    activeclassname="is-active"
                    to={item.href}
                    onClick={() => analytics(trackHeaderClick(item.label))}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li aria-hidden="true">
                <Divider />
              </li>
              <SessionButtons>{this.renderSessionButtons()}</SessionButtons>
            </InnerList>
          </Wrap>
        )}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    analytics: analyticsPayload =>
      dispatch({ type: 'analytics', meta: { analytics: analyticsPayload } }),
    ...bindActionCreators({ logOut }, dispatch),
  };
};
export default connect(
  null,
  mapDispatchToProps,
)(MobileNav);
