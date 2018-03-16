// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG
import { media } from '../../../../libs/styled';

// STYLES
const Description = styled.span`
  display: ${props => props.type || 'block'};
  margin-right: 15px;
  margin-bottom: 15px;
  font-size: 22px;
  font-weight: 500;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: text-bottom;
`;

// MODULE
export default function CartDescription({ description, type }) {
  return <Description type={type}>{description}</Description>;
}

// Props Validation
CartDescription.propTypes = {};
