// NPM
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// COMPONENTS
import { Logo } from '../../icons';

// ACTIONS/CONFIG
// import { sizes, resetButton } from '../../../libs/styled';

// STYLES
const Wrap = styled.div`
  margin-right: 25px;
  z-index: 21;
  flex-grow: 0;
  display: flex;
  align-items: center;
`;

// const ArrowWrap = styled.span`
//   color: ${props => (props.menuIsOpened ? '#62B69E' : 'white')};
//   display: inline-block;
//   font-size: 12px;
//   transform: rotate(${props => (props.menuIsOpened ? '180deg' : '0deg')});
//   transition: transform 0.2s ease-out, color 0.1s ease-out;
//   width: 15px;
// `;

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
export default function TopBarLogo({ menuIsOpened, toggleMenu, applyFixation }) {
  return (
    <Wrap>
      <LogoLink to="/" aria-label="Please homepage">
        <Logo />
      </LogoLink>
    </Wrap>
  );
}

// Props Validation
TopBarLogo.propTypes = {
  menuIsOpened: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  applyFixation: PropTypes.bool.isRequired,
};
