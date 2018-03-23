// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Media from "react-media";

// COMPONENTS
import Button from "../../Button";
// COMMENT: the homeSearch is just for the time being
import HomeSearch from "../../../scenes/Home/components/HomeSearch";

// ACTIONS/CONFIG
import { sizes, media } from "../../../libs/styled";

// STYLES
const Wrap = styled.div`
  background: white;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 21;
`;

const Header = styled.div`
  align-items: center;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  height: 65px;
  justify-content: space-between;
  padding: 0 15px;

  ${media.minMedium} {
    height: 95px;
    padding: 0 25px;
  }
`;

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
              onClick={() => {
                alert("clearing");
              }}
              type="button"
              text="clear"
            />
          </Header>
          <HomeSearch />
        </Wrap>
      )}
    />
  );
}

// Props Validation
MobileSearch.propTypes = {
  searchIsHidden: PropTypes.bool.isRequired,
  toggleSearch: PropTypes.func.isRequired
};
