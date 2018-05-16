// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

// COMPONENTS
import Logo from "./Logo";
import Search from "./Search";
import DesktopNav from "./nav/DesktopNav";
import MobileSearch from "./Search/MobileSearch";
import MobileNav from "./nav/MobileNav";

// ACTIONS/CONFIG
import { media } from "../../libs/styled";

// STYLES
const InnerWrap = styled.header`
  align-items: center;
  background: ${props =>
    props.home && !props.showMenu ? "transparent" : "white"};
  display: flex;
  height: 65px;
  padding: ${props => (props.withPadding ? "0 15px" : "0")};
  width: 100%;
  z-index: 21;
  ${props =>
    props.showMenu &&
    css`
      position: fixed;
      top: 0;
    `} ${media.minMedium} {
    height: 95px;
    padding: ${props => (props.withPadding ? "0 25px" : "0")};
  }

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
      left: 0;
      position: fixed;
      top: 0;
    `};
`;

// MODULE
export default class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      showSearch: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  toggleMenu() {
    const { showMenu } = this.state;
    const body = document.body;
    if (showMenu) {
      body.style.overflow = "";
    } else {
      body.style.overflow = "hidden";
    }
    this.setState({ showMenu: !showMenu });
  }

  toggleSearch() {
    const { showSearch } = this.state;
    this.setState({ showSearch: !showSearch });
  }

  render() {
    const { home, fixed, noSearch, withPadding } = this.props;
    const { showMenu, showSearch } = this.state;

    return (
      <div>
        <InnerWrap
          // eslint-disable-next-line
          role="baner"
          showShadow={fixed && !showMenu}
          showMenu={showMenu}
          withPadding={withPadding}
          home={home}
          fixed={fixed}
        >
          <Logo
            menuIsOpened={showMenu}
            toggleMenu={this.toggleMenu}
            applyFixation={showMenu && !fixed}
          />
          {!noSearch && (
            <Search menuIsOpened={showMenu} toggleSearch={this.toggleSearch} />
          )}
          <DesktopNav {...this.props} home={home} />
        </InnerWrap>
        <MobileSearch
          searchIsHidden={!showSearch}
          toggleSearch={this.toggleSearch}
        />
        <MobileNav menuIsOpened={showMenu} />
      </div>
    );
  }
}

// Props Validation
TopBar.propTypes = {
  home: PropTypes.bool,
  fixed: PropTypes.bool,
  noSearch: PropTypes.bool,
  withPadding: PropTypes.bool
};

TopBar.defaultProps = {
  home: false,
  fixed: false,
  noSearch: false,
  withPadding: false
};
