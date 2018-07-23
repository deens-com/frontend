// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS
import { PinIcon } from '../icons';

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  color: ${props => props.color || 'inherit'};
  cursor: pointer;
  font-size: 32px;
  height: 30px;
  left: -15px;
  position: relative;
  top: -15px;
  transform: ${props => (props.$hover ? 'scale(1.1)' : 'scale(1)')};
  transition: transform 0.1s ease-out;
  width: 30px;
`;

// MODULE
export default function MapMaker({ withIcon, color, $hover }) {
  return (
    <Wrap $hover={$hover} color={color}>
      {withIcon ? <PinIcon /> : <PinIcon />}
    </Wrap>
  );
}

// Props Validation
MapMaker.propTypes = {};
