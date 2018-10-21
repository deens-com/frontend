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
  z-index: ${props => (props.$hover ? 5 : 1)};
`;
const Label = styled.div`
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);

  padding: 6px;
  background: white;
  color: black;

  font-size: 14px;
  white-space: nowrap;

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: ${props => (props.$hover ? 1 : 0)};
  transition: opacity 0.1s ease-out;
`;

// MODULE
export default function MapMaker({ withIcon, color, $hover, name, hover }) {
  return (
    <Wrap $hover={hover || $hover} color={color}>
      <div>
        <Label $hover={hover || $hover} className="name">
          {name}
        </Label>
        {withIcon ? <PinIcon /> : <PinIcon />}
      </div>
    </Wrap>
  );
}

// Props Validation
MapMaker.propTypes = {};
