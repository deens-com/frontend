// NPM
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import styled, { css } from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import Button from '../../Button';
import Select from '../../Form/controls/Select';

// ACTIONS/CONFIG
import { sizes } from '../../../libs/styled';
import theme from '../../../config/theme';
import { mainNav, languages, currencies } from '../../../data/nav';

// STYLES
const Wrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const Nav = styled.nav`
  ${props =>
    props.homeTheme &&
    css`
      a {
        color: white;
      }
    `};
`;

const NavLink = styled(Link)`
  padding: 5px;
  margin-right: 15px;
  position: relative;
  display: inline-block;
  transition: color 0.1s ease-in;

  &:last-child {
    margin-right: 0;
  }

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: #4fb798;
    position: absolute;
    bottom: 0;
    opacity: 0;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.1s ease-in;
  }

  &.is-active,
  &:hover {
    color: #4fb798;

    &:after {
      opacity: 1;
      transition: opacity 0.2s ease-in;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  padding-left: 15px;

  > div:first-child {
    margin-right: 15px;
  }

  > div:nth-child(3) {
    margin-right: 15px;
    margin-left: 15px;
  }
`;

const Dropdown = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

// MODULE
export default function TopBarDesktopNav({ homeTheme, language, currency }) {
  return (
    <Media
      query={`(min-width: ${sizes.large})`}
      render={() => (
        <Wrap>
          <Nav homeTheme={homeTheme}>
            {mainNav.map(item => (
              <NavLink key={item.label} activeClassName="is-active" to={item.href}>
                {item.label}
              </NavLink>
            ))}
          </Nav>
          <Actions>
            <Select
              onChange={ev => {
                console.log(ev.target.value);
              }}
              value={language}
              optionList={languages}
              theme="light"
            />
            <Select
              onChange={ev => {
                console.log(ev.target.value);
              }}
              value={currency}
              optionList={currencies}
              theme="light"
            />
            <Button type="link" theme={{ ...theme.button.white }} round size="small" href="/login">
              Login
            </Button>
            <Button
              type="link"
              theme={{ ...theme.button.mainFilled }}
              round
              size="small"
              href="/signup"
            >
              Sign up
            </Button>
          </Actions>
        </Wrap>
      )}
    />
  );
}

// Props Validation
TopBarDesktopNav.propTypes = {};
