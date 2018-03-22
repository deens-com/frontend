// NPM
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import Media from "react-media";

// COMPONENTS
import Button from "../../Button";
import { Logo, DropArrow } from "../../icons";

// ACTIONS/CONFIG
import { sizes, resetButton } from "../../../libs/styled";

// STYLES
const Wrap = styled.div`
  margin-right: 25px;
  z-index: 21;
`;

const LogoWrap = styled.span`
  display: inline-block;
  height: 50px;
  width: 90px;
`;

const ArrowWrap = styled.span`
  color: ${props => (props.menuIsOpened ? "#62B69E" : "white")};
  display: inline-block;
  font-size: 12px;
  transform: rotate(${props => (props.menuIsOpened ? "180deg" : "0deg")});
  transition: transform 0.2s ease-out, color 0.1s ease-out;
  width: 15px;
`;

const LogoButton = styled.button`
  ${resetButton()} display: flex;
  align-items: center;
  outline: none;

  &:hover {
    ${ArrowWrap} {
      color: #62b69e;
    }
  }
`;

const LogoLink = styled(Link)`
  display: inline-block;
  height: 50px;

  svg {
    height: 50px;
    width: auto;
  }
  span {
    display: none;
  }
`;

// MODULE
export default function TopBarLogo({
  menuIsOpened,
  toggleMenu,
  applyFixation
}) {
  return (
    <Media query={`(max-width: ${sizes.large})`}>
      {matches =>
        matches ? (
          <Wrap applyFixation={applyFixation}>
            <LogoButton
              aria-label="Main navigation menu"
              aria-haspopup={true}
              onClick={toggleMenu}
            >
              <LogoWrap>
                <Logo />
              </LogoWrap>
              <ArrowWrap menuIsOpened={menuIsOpened}>
                <DropArrow />
              </ArrowWrap>
            </LogoButton>
          </Wrap>
        ) : (
          <Wrap>
            <LogoLink to="/" aria-label="Please homepage">
              <Logo />
            </LogoLink>
          </Wrap>
        )
      }
    </Media>
  );
}

// Props Validation
TopBarLogo.propTypes = {
  menuIsOpened: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  applyFixation: PropTypes.bool.isRequired
};
