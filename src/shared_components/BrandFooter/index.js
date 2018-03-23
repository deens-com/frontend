// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

// COMPONENTS
import { Logo } from "../icons";
import { Instagram, Twitter, Facebook } from "./icons";

// ACTIONS/CONFIG
import { media } from "../../libs/styled";

// STYLES
const Wrapper = styled.footer`
  padding: ${props =>
    props.withPadding ? "10px 25px 15px 25px" : "10px 0 15px 0"};
  display: flex;
  flex-direction: column;
  border-top: 1px solid
    ${props => (props.withTopBorder ? "#efeff0" : "transparent")};

  ${media.minSmall} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Company = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  ${media.minSmall} {
    margin-bottom: 0;
  }

  svg {
    display: block;
    width: auto;
    height: 50px;
    margin-right: 15px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #61676d;
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;

  & > div:first-child {
    margin-right: 25px;
  }
`;

const FLink = styled(Link)`
  font-size: 14px;
  display: inline-block;
  padding: 3px 4px;
`;

// MODULE
export default function Footer({ withTopBorder, withPadding }) {
  return (
    <Wrapper withTopBorder={withTopBorder} withPadding={withPadding}>
      <Company>
        <Logo />
        <span>© Please Inc.</span>
      </Company>
      <Nav>
        <div>
          <FLink to="/">Terms</FLink>
          <FLink to="/">Privacy</FLink>
          <FLink to="/">Sitemap</FLink>
        </div>
        <div>
          <FLink to="/">
            <Facebook
              style={{
                height: "16px",
                width: "16px",
                display: "block",
                fill: "rgb(118, 118, 118)"
              }}
            />
          </FLink>
          <FLink to="/">
            <Twitter
              style={{
                height: "16px",
                width: "16px",
                display: "block",
                fill: "rgb(118, 118, 118)"
              }}
            />
          </FLink>
          <FLink to="/">
            <Instagram
              style={{
                height: "16px",
                width: "16px",
                display: "block",
                fill: "rgb(118, 118, 118)"
              }}
            />
          </FLink>
        </div>
      </Nav>
    </Wrapper>
  );
}

// Props Validation
Footer.propTypes = {};
