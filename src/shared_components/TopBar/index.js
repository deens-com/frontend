// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// COMPONENTS
import Logo from './Logo';
import Search from './Search';
import DesktopNav from './nav/DesktopNav';
import MobileSearch from './Search/MobileSearch';
import MobileNav from './nav/MobileNav';

// ACTIONS/CONFIG
import { media } from '../../libs/styled';

// STYLES
const Wrap = styled.div``;

const InnerWrap = styled.header`
  height: 95px;
  width: 100%;
  background: ${props => (props.transparent ? 'transparent' : 'white')};
  display: flex;
  align-items: center;
  z-index: 21;
  padding: ${props => (props.withPadding ? '0 25px' : '0')};

  ${props =>
    props.showShadow &&
    css`
      border-bottom: 1px solid #efeff0;

      ${media.minMedium} {
        border-bottom: none;
        box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
      }
    `} ${props =>
    props.fixed &&
    css`
      position: fixed;
      top: 0;
      left: 0;
    `};
`;

// MODULE
export default class TopBar extends Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
      showSearch: false,
      language: 'english',
      currency: 'EUR'
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }

  toggleSearch() {
    this.setState({ showSearch: !this.state.showSearch });
  }

  render() {
    const { transparent, fixed, noSearch, withPadding } = this.props;

    return (
      <Wrap>
        <InnerWrap
          showShadow={fixed && !this.state.showMenu}
          withPadding={withPadding}
          transparent={transparent}
          fixed={fixed}
        >
          <Logo
            menuIsOpened={this.state.showMenu}
            toggleMenu={this.toggleMenu}
            applyFixation={this.state.showMenu && !fixed}
          />
          {!noSearch && (
            <Search menuIsOpened={this.state.showMenu} toggleSearch={this.toggleSearch} />
          )}
          <DesktopNav
            homeTheme={transparent}
            language={this.state.language}
            currency={this.state.currency}
          />
        </InnerWrap>
        <MobileSearch searchIsHidden={!this.state.showSearch} toggleSearch={this.toggleSearch} />
        <MobileNav
          menuIsOpened={this.state.showMenu}
          language={this.state.language}
          currency={this.state.currency}
        />
      </Wrap>
    );
  }
}

// Props Validation
TopBar.propTypes = {};
