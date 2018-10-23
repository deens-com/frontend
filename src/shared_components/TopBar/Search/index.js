// NPM
import React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import styled from 'styled-components';

// COMPONENTS
import { SearchIcon } from '../../icons';
import DesktopSearch from './DesktopSearch';

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
`;

// MODULE
export default function TopBarSearch({ menuIsOpened, toggleSearch, address }) {
  if (menuIsOpened) return null;

  return (
    <Media query={`(max-width: ${sizes.small})`}>
      {matches =>
        matches ? (
          <TriggerWrap onClick={toggleSearch}>
            <SearchIcon />
          </TriggerWrap>
        ) : (
          <DesktopSearch address={address} />
        )
      }
    </Media>
  );
}

// Props Validation
TopBarSearch.propTypes = {
  menuIsOpened: PropTypes.bool.isRequired,
  toggleSearch: PropTypes.func.isRequired,
};
