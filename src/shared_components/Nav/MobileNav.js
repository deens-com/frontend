// NPM
import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Media from "react-media";
import Parse from "parse";

// COMPONENTS
import CurrencySelector from "../Currency/Selector";

// ACTIONS/CONFIG
import { sizes } from "../../libs/styled";
import { mainNav } from "../../data/nav";

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

const Divider = styled.hr`
  border: none;
  margin: 15px 0;
  height: 1px;
  background: #efeff0;
`;

// MODULE
export default class MobileNav extends Component {

  componentDidMount() {
    if(Parse.User.current() === null){
      this.setState({ logged_in: false });
    }else{
      this.setState({ logged_in: true });
    }
  }

  guestDropdown() {
    return (
      <span>
        <li>
          <NavLink to="/register">Sign up</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </span>
    )
  }

  render() {
    if (!this.props.menuIsOpened) return null;

    return (
      <Media
        query={`(max-width: ${sizes.large})`}
        render={() => (
          <Wrap>
            <InnerList>
              <li aria-hidden="false">
                <NavLink to="/">Home</NavLink>
              </li>
              <li aria-hidden="true">
                <Divider />
              </li>
              {mainNav.map(item => (
                <li aria-hidden="false" key={item.label}>
                  <NavLink activeclassname="is-active" to={item.href}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li aria-hidden="true">
                <Divider />
              </li>
              <li>
                <CurrencySelector />
              </li>
              <li aria-hidden="true">
                <Divider />
              </li>
              {!this.state.logged_in && this.guestDropdown() }
            </InnerList>
          </Wrap>
        )}
      />
    );
  }
}
