// NPM
import React from 'react';
import styled, { css } from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG
import { media } from '../../libs/styled';

// STYLES
const ColWrapper = styled.div`
  display: inline-block;
  padding-right: ${props => props.paddingRight || '10px'};
  padding-left: ${props => props.paddingLeft || '10px'};
  width: ${props => props.basis || props.xsBasis || '100%'};
  flex-basis: ${props => props.basis || props.xsBasis || '100%'};
  max-width: ${props => props.basis || props.xsBasis || '100%'};

  ${media.minSmall} {
    ${props =>
      props.smBasis &&
      css`
        flex-basis: ${props.smBasis};
        max-width: ${props.smBasis};
        width: ${props.smBasis};
      `};
  }

  ${media.minMedium} {
    ${props =>
      props.mdBasis &&
      css`
        flex-basis: ${props.mdBasis};
        max-width: ${props.mdBasis};
        width: ${props.mdBasis};
      `};
  }

  ${media.minLarge} {
    ${props =>
      props.lgBasis &&
      css`
        flex-basis: ${props.lgBasis};
        max-width: ${props.lgBasis};
        width: ${props.lgBasis};
      `};
  }
`;

// MODULE
export default function Col(props) {
  return <ColWrapper {...props}>{props.children}</ColWrapper>;
}

// Props Validation
Col.propTypes = {};
