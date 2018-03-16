// NPM
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import styled, { css } from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import Button from '../../Button';
import { Logo, DropArrow } from '../../icons';

// ACTIONS/CONFIG
import { sizes, resetButton } from '../../../libs/styled';

// STYLES
const Wrap = styled.div`
  margin-right: 25px;
  z-index: 21;
  ${props =>
    props.applyFixation &&
    css`
      position: fixed;
    `};
`;

const LogoWrap = styled.span`
  display: inline-block;
  width: 90px;
  height: 50px;
`;

const ArrowWrap = styled.span`
  display: inline-block;
  width: 15px;

  svg {
    fill: ${props => (props.menuIsOpened ? '#62B69E' : '#a2b2c1')};
    transition: transform 0.2s ease-out;
  }
`;

const LogoButton = styled.button`
  ${resetButton()} display: flex;
  align-items: center;
  outline: none;

  &:hover {
    ${ArrowWrap} svg {
      fill: #62b69e;
    }
  }
`;

const LogoLink = styled(Link)`
  height: 50px;
  display: inline-block;

  svg {
    height: 50px;
    width: auto;
  }
  span {
    display: none;
  }
`;

// MODULE
export default function TopBarLogo({ menuIsOpened, toggleMenu, applyFixation }) {
  return (
    <Media query={`(max-width: ${sizes.large})`}>
      {matches =>
        matches ? (
          <Wrap applyFixation={applyFixation}>
            <LogoButton onClick={toggleMenu}>
              <LogoWrap>
                <Logo />
              </LogoWrap>
              <ArrowWrap menuIsOpened={menuIsOpened}>
                <DropArrow
                  style={{
                    transform: menuIsOpened ? 'rotate(-180deg)' : 'rotate(0deg)'
                  }}
                />
              </ArrowWrap>
            </LogoButton>
          </Wrap>
        ) : (
          <Wrap>
            <LogoLink to="/">
              <Logo />
            </LogoLink>
          </Wrap>
        )
      }
    </Media>
  );
}

// Props Validation
TopBarLogo.propTypes = {};
