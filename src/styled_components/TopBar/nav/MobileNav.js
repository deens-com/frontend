// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'gatsby-link';
import Media from 'react-media';

// COMPONENTS
import Select from '../../Form/controls/Select';

// ACTIONS/CONFIG
import { sizes } from '../../../libs/styled';
import { mainNav, languages, currencies } from '../../../data/nav';

// STYLES
const Wrap = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;

  select {
    padding: 12px 0;
    font-size: 24px;
    margin-bottom: 15px;
    color: #6e7885;
  }
`;

const InnerList = styled.ul`
  background: white;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 25px;
  padding-top: 95px;
  list-style-type: none;
`;

const NavLink = styled(Link)`
  display: block;
  padding: 12px 0;
  font-size: 24px;
  margin-bottom: 15px;

  &.is-active {
    color: #4fb798;
  }
`;

const Divider = styled.hr`
  border: 0px;
  border-top: 1px solid #efeff0;
  margin: 15px 0;
  height: 0px;
`;

// MODULE
export default function MobileNav({ menuIsOpened, language, currency }) {
  if (!menuIsOpened) return null;

  return (
    <Media
      query={`(max-width: ${sizes.large})`}
      render={() => (
        <Wrap>
          <InnerList>
            <li ariaHidden="false">
              <NavLink to="/">Home</NavLink>
            </li>
            <li ariaHidden="true">
              <Divider />
            </li>
            {mainNav.map(item => (
              <li ariaHidden="false" key={item.label}>
                <NavLink activeClassName="is-active" to={item.href}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li ariaHidden="true">
              <Divider />
            </li>
            <li>
              <Select
                onChange={ev => {
                  console.log(ev.target.value);
                }}
                value={language}
                optionList={languages}
              />
            </li>
            <li>
              <Select
                onChange={ev => {
                  console.log(ev.target.value);
                }}
                value={currency}
                optionList={currencies}
              />
            </li>
            <li ariaHidden="true">
              <Divider />
            </li>
            <li>
              <NavLink to="/sign-in">Sign up</NavLink>
            </li>
            <li>
              <NavLink to="/log-in">Log in</NavLink>
            </li>
          </InnerList>
        </Wrap>
      )}
    />
  );
}

// Props Validation
MobileNav.propTypes = {};
