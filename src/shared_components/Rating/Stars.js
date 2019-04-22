// NPM
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import stars0 from 'assets/yelp/large_0.png';
import stars1 from 'assets/yelp/large_1.png';
import stars1Half from 'assets/yelp/large_1_half.png';
import stars2 from 'assets/yelp/large_2.png';
import stars2Half from 'assets/yelp/large_2_half.png';
import stars3 from 'assets/yelp/large_3.png';
import stars3Half from 'assets/yelp/large_3_half.png';
import stars4 from 'assets/yelp/large_4.png';
import stars4Half from 'assets/yelp/large_4_half.png';
import stars5 from 'assets/yelp/large_5.png';

import { primary, tertiary } from 'libs/colors';
// COMPONENTS
import Star from './Star';

const yelpDict = {
  0: stars0,
  1: stars1,
  1.5: stars1Half,
  2: stars2,
  2.5: stars2Half,
  3: stars3,
  3.5: stars3Half,
  4: stars4,
  4.5: stars4Half,
  5: stars5,
};

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

const YelpRating = styled.img`
  width: 88px;
  height: 16px;
  margin-top: 2px;
  margin-right: 4px;
`;

const emptyColor = 'rgba(18, 84, 95, 0.25)';

function getFill(rating, starNumber, type) {
  if (starNumber <= rating + 0.25) {
    if (type === 'golden') {
      return tertiary;
    }
    return primary;
  }
  const colorVariable = type === 'golden' ? 'halfStarGradientGolden' : 'halfStarGradient';
  if (starNumber > rating + 0.25 && starNumber < rating + 0.75) {
    return `url(#${colorVariable})`;
  }
  return emptyColor;
}

// MODULE
export default function StarsWrap({ rating, type, length = 5, width = 14, height = 15 }) {
  return (
    <Stars>
      {type === 'yelp' ? (
        <YelpRating src={yelpDict[rating] || yelpDict[0]} />
      ) : (
        Array.apply(null, { length }).map((e, index) => (
          <StarWrap key={index} width={width} height={height}>
            <Star style={{ fill: getFill(Number(rating), index + 1, type), width, height }} />
          </StarWrap>
        ))
      )}
    </Stars>
  );
}

// Props Validation
StarsWrap.propTypes = {
  type: PropTypes.oneOf(['default', 'golden', 'yelp']),
};

StarsWrap.defaultProps = {
  type: 'default',
};
