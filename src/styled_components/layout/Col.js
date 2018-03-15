// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const ColWrapper = styled.div`
  box-sizing: border-box;
  display: ${props => (props.flex ? 'flex' : 'block')};
  padding-right: ${props => props.paddingRight || '10px'};
  padding-left: ${props => props.paddingLeft || '10px'};
  flex-grow: ${props => props.grow || props.xsGrow || '1'};
  flex-basis: ${props => props.basis || props.xsBasis || '0'};
  max-width: ${props => props.basis || props.xsBasis || '100%'};

  ${props =>
    props.flex &&
    css`
      display: flex;
      flex-direction: ${props.direction || 'row'};
    `} @media only screen and (min-width: 38em) {
    ${props =>
      props.smGrow &&
      css`
        flex-grow: ${props.smGrow};
      `} ${props =>
        props.smBasis &&
        css`
          flex-basis: ${props.smBasis};
          max-width: ${props.smBasis};
        `};
  }

  @media only screen and (min-width: 54em) {
    ${props =>
      props.mdGrow &&
      css`
        flex-grow: ${props.mdGrow};
      `} ${props =>
        props.mdBasis &&
        css`
          flex-basis: ${props.mdBasis};
          max-width: ${props.mdBasis};
        `};
  }

  @media only screen and (min-width: 65em) {
    ${props =>
      props.lgGrow &&
      css`
        flex-grow: ${props.lgGrow};
      `} ${props =>
        props.lgBasis &&
        css`
          flex-basis: ${props.lgBasis};
          max-width: ${props.lgBasis};
        `};
  }
`;

// MODULE
export default function Col(props) {
  return <ColWrapper {...props}>{props.children}</ColWrapper>;
}

// Props Validation
Col.propTypes = {};
