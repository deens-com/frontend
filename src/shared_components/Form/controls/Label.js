// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Label = styled.label`
  display: block;
  margin: 0 0 7px;
`;

// MODULE
export default function FormLabel(props) {
  return <Label htmlFor={props.id}>{props.label}</Label>;
}

// Props Validation
FormLabel.propTypes = {};
