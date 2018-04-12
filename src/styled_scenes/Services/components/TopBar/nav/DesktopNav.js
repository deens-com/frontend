// NPM
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import Media from "react-media";

// COMPONENTS
import Button from "../../../../../shared_components/Button";
import Select from "../../../../../shared_components/Form/controls/Select";
import FlagSelect from "../../../../../shared_components/FlagSelect";

// ACTIONS/CONFIG
import { sizes } from "../../../../../libs/styled";
import { mainNav, languages, currencies } from "../../../../../data/nav";

// STYLES
const Wrap = styled.div`
  align-items: center;
  display: flex;
  margin-left: auto;

  ${props =>
    props.home &&
    css`
      & .Select--single > .Select-control .Select-value {
        color: white;
      }
    `};
`;

const Nav = styled.nav`
  ${props =>
    props.home &&
    css`
      a {
        color: white;
      }
    `};
`;

const NavLink = styled(Link)`
  display: inline-block;
  margin-right: 15px;
  padding: 5px;
  position: relative;
  transition: color 0.1s ease-in;

  &:last-child {
    margin-right: 0;
  }

  &:after {
    background: #4fb798;
    bottom: 0;
    content: "";
    display: block;
    height: 2px;
    left: 50%;
    opacity: 0;
    position: absolute;
    transform: translateX(-50%);
    transition: opacity 0.1s ease-in;
    width: 100%;
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

const ActionsWrap = styled.div`
  align-items: center;
  display: flex;
  padding-left: 15px;

  .Select-multi-value-wrapper {
    min-width: 37px;
  }

  > div:first-child {
    margin-right: 15px;
  }

  > div:nth-child(3) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

// MODULE
export default function TopBarDesktopNav(props) {
  let service_types = props.search_query.type;
  return (
    <Media
      query={`(min-width: ${sizes.large})`}
      render={() => (
        <Wrap home={props.home}>
          <Nav home={props.home}>
            {mainNav.map(item => (
              <NavLink
                key={item.label}
                className={(service_types && service_types.includes(item.service_type)) ? "is-active" : ""}
                activeClassName="is-active"
                to={item.href}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
          <ActionsWrap>
            <FlagSelect
              countries={["US", "GB", "FR", "DE", "IT"]}
              customLabels={{
                US: "EN-US",
                GB: "EN-GB",
                FR: "FR",
                DE: "DE",
                IT: "IT"
              }}
              placeholder="Select Language"
              showSelectedLabel={false}
              defaultCountry="US"
              onSelect={countryCode => {
                console.log(countryCode);
              }}
            />
            <Select
              onChange={val => {
                console.log(val);
              }}
              value="EUR"
              options={currencies}
              theme={props.home ? "light" : "inherit"}
            />
            <Button type="link" theme="white" round size="small" href="/login">
              Login
            </Button>
            <Button
              type="link"
              theme="mainFilled"
              round
              size="small"
              href="/register"
            >
              Sign up
            </Button>
          </ActionsWrap>
        </Wrap>
      )}
    />
  );
}

// Props Validation
TopBarDesktopNav.propTypes = {
  home: PropTypes.bool.isRequired,
  language: PropTypes.string,
  currency: PropTypes.string
};

TopBarDesktopNav.defaultProps = {
  language: "english",
  currency: "EUR"
};
