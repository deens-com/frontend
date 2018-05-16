// NPM
import React from "react";
import styled, { css } from "styled-components";

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const RowWrapper = styled.div`
  display: ${props => (props.flex ? "flex" : "block")};
  ${props =>
    props.noMargin
      ? css`
          margin: 0;
        `
      : css`
          margin: ${props => props.margin || "0 -10px"};
        `};
`;

// MODULE
export default function Row(props) {
  return <RowWrapper {...props}>{props.children}</RowWrapper>;
}

// Props Validation
Row.propTypes = {};
