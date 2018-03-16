// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const RowWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 0 1 auto;
  flex-direction: ${props => (props.reverse ? 'row-reverse' : 'row')};
  ${props =>
    props.wrap &&
    css`
      flex-wrap: wrap;
    `}
  ${props =>
    props.center &&
    css`
      align-items: center;
    `} ${props =>
  props.noMargin
    ? css`
        margin: 0;
      `
    : css`
        margin: ${props => props.margin || '0 -10px'};
      `};
`;

// MODULE
export default function Row(props) {
  return <RowWrapper {...props}>{props.children}</RowWrapper>;
}

// Props Validation
Row.propTypes = {};
