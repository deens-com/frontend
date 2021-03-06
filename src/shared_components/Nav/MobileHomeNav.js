import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { logOut } from 'store/session/actions';
import I18nText from 'shared_components/I18nText';
import ImgurAvatar from 'assets/no-avatar.png';
import { primary, secondary } from 'libs/colors';
import Account from 'shared_components/icons/AccountCircle';
import urls from 'libs/urlGenerator';
import { Trans } from '@lingui/macro';

const Wrap = styled.div`
  justify-self: flex-end;
  z-index: 20;
  color: ${primary};
  display: flex;
  align-items: center;
  position: relative;
  margin-left: auto;
  max-width: 200px;
`;

const Menu = styled.ul`
  position: absolute;
  background-color: white;
  top: 60px;
  padding: 15px 0;
  right: 0;
  width: 150px;
  color: ${primary};
  list-style: none;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
`;

const MenuLink = styled(Link)`
  padding: 8px 15px;
  color: inherit;
  display: inline-block;
`;

const Divider = styled.li`
  border-bottom: 1px solid #e0e0e0;
  margin: 8px 0;
`;

class MobileHomeNav extends Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.state = {
      isOpen: false,
    };
  }
  logout = () => {
    this.props.logOut();
    this.toggleMenu();
  };

  onOptionClick = () => {
    this.toggleMenu();
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (!this.state.isOpen) {
      return;
    }
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      this.toggleMenu();
    }
  };

  toggleMenu = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  renderMenu = () => {
    const avatar = this.props.session.profilePicture || ImgurAvatar;
    const Button = this.props.session.username ? (
      <img
        onClick={() => this.toggleMenu()}
        style={{ borderRadius: '5px 5px 5px 0', width: '40px', marginLeft: '15px' }}
        src={avatar}
        alt={this.props.session.username}
      />
    ) : (
      <span onClick={() => this.toggleMenu()}>
        <Account
          style={{
            fill: primary,
            height: '40px',
            width: '40px',
            marginLeft: '15px',
          }}
        />
      </span>
    );
    const sessionMenu = this.props.session.username ? (
      <li onClick={this.logout} style={{ padding: '8px 15px' }}>
        <Trans>Logout</Trans>
      </li>
    ) : (
      <>
        <li>
          <MenuLink to="/register">
            <Trans>Sign up</Trans>
          </MenuLink>
        </li>
        <li>
          <MenuLink to="/login">
            <Trans>Login</Trans>
          </MenuLink>
        </li>
      </>
    );
    return (
      <>
        {this.props.latestTrip && (
          <Link
            style={{ height: '1.2em', overflow: 'hidden', color: 'inherit' }}
            to={urls.trip.organize(this.props.latestTrip._id)}
          >
            <I18nText data={this.props.latestTrip.title} />
          </Link>
        )}
        {Button}
        {this.state.isOpen && (
          <Menu>
            <li>
              <MenuLink
                to={{
                  pathname: '/new/trip',
                  state: {
                    modal: true,
                  },
                }}
                onClick={this.onOptionClick}
              >
                <Trans>Create Trip</Trans>
              </MenuLink>
            </li>
            <li style={{ color: secondary }}>
              <MenuLink onClick={this.onOptionClick} to="/earn-money">
                <Trans>Earn Money</Trans>
              </MenuLink>
            </li>
            {this.props.session.username && (
              <>
                <Divider />
                <li>
                  <MenuLink onClick={this.onOptionClick} to="/my/trips">
                    <Trans>My Trips</Trans>
                  </MenuLink>
                </li>
                <li>
                  <MenuLink onClick={this.onOptionClick} to="/my/profile">
                    <Trans>Profile</Trans>
                  </MenuLink>
                </li>
              </>
            )}
            <Divider />
            {sessionMenu}
          </Menu>
        )}
      </>
    );
  };

  render() {
    return <Wrap ref={this.wrapperRef}>{this.renderMenu()}</Wrap>;
  }
}

const mapStateToProps = state => ({
  session: state.session.session,
});

const mapDispatchToProps = dispatch => {
  return {
    analytics: analyticsPayload =>
      dispatch({ type: 'analytics', meta: { analytics: analyticsPayload } }),
    ...bindActionCreators({ logOut }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileHomeNav);
