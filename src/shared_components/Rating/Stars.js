// NPM
import React from 'react';
import styled from 'styled-components';

import { primary } from 'libs/colors';
// COMPONENTS
import Star from './Star';

// ACTIONS/CONFIG

// STYLES
const Stars = styled.div`
  justify-content: center;
  display: flex;
`;

const StarWrap = styled.div`
  display: inline-block;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  margin-right: 2px;

  &:last-child {
    margin-right: 0;
  }
`;

const emptyColor = 'rgba(18, 84, 95, 0.25)';

function getFill(rating, starNumber) {
  if (starNumber <= rating) {
    return primary;
  }
  if (starNumber > rating && starNumber < rating + 1) {
    return 'url(#halfStarGradient)';
  }
  return emptyColor;
}

// MODULE
export default function StarsWrap({ rating, length = 5, width = 14, height = 15 }) {
  return (
    <Stars>
      {Array.apply(null, { length }).map((e, index) => (
        <StarWrap key={index} width={width} height={height}>
          <Star style={{ fill: getFill(Number(rating), index + 1), width, height }} />
        </StarWrap>
      ))}
    </Stars>
  );
}

// Props Validation
StarsWrap.propTypes = {};
