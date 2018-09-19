// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG
import { media } from '../../../../libs/styled';

// STYLES
const Description = styled.span`
  display: ${props => props.type || 'block'};
  margin-right: 15px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;

  ${media.minMedium} {
    font-size: 22px;
  }
`;

// MODULE
export default function CartDescription(props) {
  const { description, type } = props;
  if (props.children) {
    return <Description type={type}>{props.children}</Description>;
  }
  return <Description type={type}>{description}</Description>;
}

// Props Validation
CartDescription.propTypes = {};
