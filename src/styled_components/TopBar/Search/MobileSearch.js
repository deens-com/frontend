// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import Button from '../../Button';
import HomeSearch from '../../../styled_scenes/Home/components/HomeSearch';

// ACTIONS/CONFIG
import { sizes } from '../../../libs/styled';

// STYLES
const Wrap = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 21;
  background: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 95px;
  padding: 0 25px;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
`;

const Content = styled.div``;

// MODULE
export default function MobileSearch({ searchIsHidden, toggleSearch }) {
  if (searchIsHidden) return null;

  return (
    <Media
      query={`(max-width: ${sizes.small})`}
      render={() => (
        <Wrap>
          <Header>
            <Button type="button" onClick={toggleSearch} text="close" />
            <span>Where</span>
            <Button
              type="button"
              onClick={() => {
                alert('clearing');
              }}
              text="clear"
            />
          </Header>
          <Content>
            <HomeSearch />
          </Content>
        </Wrap>
      )}
    />
  );
}

// Props Validation
MobileSearch.propTypes = {};
