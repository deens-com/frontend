// NPM
import React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import styled from 'styled-components';

// COMPONENTS
import { Search } from '../../icons';
import DesktopSearch from './DesktopSearch';

// ACTIONS/CONFIG
import { sizes, resetButton } from '../../../libs/styled';

// STYLES
const TriggerWrap = styled.button`
  ${resetButton()};
  margin-left: auto;
  width: 50px;
  height: 50px;
  padding: 10px;
`;

// MODULE
export default function TopBarSearch({ menuIsOpened, toggleSearch }) {
  if (menuIsOpened) return null;

  return (
    <Media query={`(max-width: ${sizes.small})`}>
      {matches =>
        matches ? (
          <TriggerWrap onClick={toggleSearch}>
            <Search style={{ fill: '#A2B2C0' }} />
          </TriggerWrap>
        ) : (
          <DesktopSearch />
        )
      }
    </Media>
  );
}

// Props Validation
TopBarSearch.propTypes = {};
