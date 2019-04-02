// NPM
import React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import styled from 'styled-components';

// COMPONENTS
import { SearchIcon } from '../../icons';
import Search from './Search';

// ACTIONS/CONFIG
import { sizes, resetButton } from '../../../libs/styled';

// STYLES
const TriggerWrap = styled.button`
  ${resetButton()};
  height: 50px;
  margin-left: auto;
  padding: 10px;
  width: 50px;
  color: #a2b2c0;
  font-size: 24px;
  margin: auto;
`;

// MODULE
export default function TopBarSearch({ isMenuOpen, toggleSearch, address, isMobileSearchOpen }) {
  if (isMenuOpen) return null;

  return (
    <Media query={`(max-width: ${sizes.small})`}>
      {matches =>
        matches && !isMobileSearchOpen ? (
          <TriggerWrap onClick={toggleSearch}>
            <SearchIcon />
          </TriggerWrap>
        ) : (
          <Search address={address} isMobile={matches} toggleSearch={toggleSearch} />
        )
      }
    </Media>
  );
}

// Props Validation
TopBarSearch.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  toggleSearch: PropTypes.func.isRequired,
};
