// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

// COMPONENTS
import DesktopNav from '../Nav/DesktopNav';
import MobileNav from '../Nav/MobileNav';
import Logo from './Logo';
import MobileDropdownMenu from '../Nav/MobileDropdownMenu';
import Search from './Search';
import { bindActionCreators } from 'redux';
import { getCurrentUserTrip, logOut } from 'store/session/actions';
import { PageWrapper } from 'shared_components/layout/Page';
import { secondaryContrast } from 'libs/colors';
import searchActions from 'store/search/actions';

// ACTIONS/CONFIG
import { media } from 'libs/styled';
import * as colors from 'libs/colors';

const Content = styled.div`
  display: flex;
  justify-content: ${props => (props.transparent ? 'space-between' : 'flex-start')};
  height: 65px;
  width: 100%;
`;

// STYLES
const Wrapper = styled.header`
  align-items: center;
  background: ${colors.backgroundLight};
  position: ${props => props.transparent && !props.showMenu && 'absolute'};
  display: flex;
  justify-content: ${props => (props.transparent ? 'space-between' : 'flex-start')};
  height: 65px;
  padding: ${props => (props.transparent ? '0' : '10px')};
  width: 100%;
  z-index: 110;
  ${props => (props.transparent ? 'left: 0;' : '')}
  ${props =>
    props.showMenu &&
    css`
      position: fixed;
      top: 0;
    `} ${media.minMedium} {
    height: 60px;
    padding: ${props => (props.fixed || !props.transparent ? '0 25px' : '0')};
  }

  ${props =>
    props.showShadow &&
    css`
      border-bottom: 1px solid ${colors.boxStroke};

      ${media.minMedium} {
        border-bottom: none;
        box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
      }
    `}
  ${props =>
    props.fixed &&
    css`
      left: 0;
      position: fixed;
      z-index: 10000;
      top: ${props => props.fixedTop || 0}px;
      transition: all 0.75s ease 0s;
    `};
`;

// So we don't need to add a margin to each page
const FixedPlaceholder = styled.div`
  margin-top: ${props => (props.noMargin ? '60px' : '85px')};
`;

// MODULE
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      showSearchMobile: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleProfileMenu = this.toggleProfileMenu.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentUserTrip();
  }

  toggleMenu() {
    const { showMenu } = this.state;
    const body = document.body;
    if (showMenu) {
      body.style.overflow = '';
    } else {
      body.style.overflow = 'hidden';
    }
    this.setState({ showMenu: !showMenu });
  }

  componentWillUnmount() {
    const body = document.body;
    body.style.overflow = '';
  }

  toggleProfileMenu() {
    const { showProfileMenu } = this.state;
    const body = document.body;
    if (showProfileMenu) {
      body.style.overflow = '';
    } else {
      body.style.overflow = 'hidden';
    }
    this.setState({ showProfileMenu: !showProfileMenu });
  }

  toggleSearch() {
    this.setState(prevState => ({ showSearchMobile: !prevState.showSearchMobile }));
  }

  render() {
    const {
      transparent,
      noSearch,
      isGDPRDismissed,
      gdprHeight,
      noMargin,
      forceNotFixed,
    } = this.props;
    const { showMenu, showSearchMobile } = this.state;

    const InnerWrap = transparent || noSearch ? PageWrapper : React.Fragment;
    return (
      <React.Fragment>
        <Wrapper
          role="baner"
          showShadow={!transparent && !showMenu}
          showMenu={showMenu}
          transparent={transparent}
          fixed={!transparent && !forceNotFixed}
          fixedTop={!isGDPRDismissed && gdprHeight}
        >
          <InnerWrap>
            <Content transparent={transparent}>
              {!showSearchMobile && (
                <Logo
                  menuIsOpened={showMenu}
                  toggleMenu={this.toggleMenu}
                  applyFixation={showMenu && transparent}
                  flex={Boolean(transparent)}
                />
              )}
              {!noSearch && (
                <Search
                  isMenuOpen={showMenu}
                  toggleSearch={this.toggleSearch}
                  address={this.props.address}
                  isMobileSearchOpen={showSearchMobile}
                  searchParams={this.props.searchParams}
                  updateSearchParams={this.props.updateSearchParams}
                />
              )}
              <DesktopNav
                latestTrip={this.props.latestTrip}
                transparent={transparent}
                theme="light"
                session={this.props.session}
                logOut={this.props.logOut}
              />
              {!showSearchMobile && (
                <MobileDropdownMenu
                  isMenuOpen={showMenu}
                  toggleMenu={this.toggleMenu}
                  dark={!transparent}
                />
              )}
            </Content>
          </InnerWrap>
        </Wrapper>
        <MobileNav
          toggleMenu={this.toggleMenu}
          showProfileMenu={showMenu}
          latestTrip={this.props.latestTrip}
        />
        {!transparent && !forceNotFixed && <FixedPlaceholder noMargin={noMargin} />}
      </React.Fragment>
    );
  }
}

// Props Validation
TopBar.propTypes = {
  transparent: PropTypes.bool,
  withPadding: PropTypes.bool,
  noMargin: PropTypes.bool,
  forceNotFixed: PropTypes.bool,
};

TopBar.defaultProps = {
  transparent: false,
  withPadding: false,
  noMargin: false,
  forceNotFixed: false,
};

const mapStateToProps = state => ({
  isGDPRDismissed: state.settings.gdprDismissed,
  gdprHeight: state.settings.gdprHeight,
  session: state.session.session,
  latestTrip: state.session.latestTrip,
  searchParams: state.search.searchQuery,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { getCurrentUserTrip, logOut, updateSearchParams: searchActions.updateSearchParams },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
