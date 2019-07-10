// NPM
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DeensDefinitions from './DeensDefinitions';

import { primary, tertiary } from 'libs/colors';
// COMPONENTS
import Deens from './Deens';
import Star from './Star';

const yelpDict = {
  0: 'https://please-com.imgix.net/yelp/large_0.png?auto=compress',
  1: 'https://please-com.imgix.net/yelp/large_1.png?auto=compress',
  1.5: 'https://please-com.imgix.net/yelp/large_1_half.png?auto=compress',
  2: 'https://please-com.imgix.net/yelp/large_2.png?auto=compress',
  2.5: 'https://please-com.imgix.net/yelp/large_2_half.png?auto=compress',
  3: 'https://please-com.imgix.net/yelp/large_3.png?auto=compress',
  3.5: 'https://please-com.imgix.net/yelp/large_3_half.png?auto=compress',
  4: 'https://please-com.imgix.net/yelp/large_4.png?auto=compress',
  4.5: 'https://please-com.imgix.net/yelp/large_4_half.png?auto=compress',
  5: 'https://please-com.imgix.net/yelp/large_5.png?auto=compress',
};

// ACTIONS/CONFIG

// STYLES
const Stars = styled.div`
  justify-content: center;
  display: flex;
`;

const StarWrap = styled.div`
  display: inline-block;
  position: relative;
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

function starType(rating, starNumber) {
  if (starNumber <= rating + 0.25) {
    return 'full';
  }
  if (starNumber > rating + 0.25 && starNumber < rating + 0.75) {
    return 'half';
  }
  return 'empty';
}

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
export default function StarsWrap({ useLogo, rating, type, length = 5, width = 14, height = 15 }) {
  return (
    <Stars>
      {type === 'yelp' ? (
        <YelpRating src={yelpDict[rating] || yelpDict[0]} />
      ) : (
        Array.apply(null, { length }).map((e, index) => (
          <StarWrap key={index} width={width} height={height}>
            {useLogo ? (
              <Deens
                starType={starType(rating, index + 1)}
                style={{ position: 'absolute', width, height }}
              />
            ) : (
              <Star style={{ fill: getFill(Number(rating), index + 1, type), width, height }} />
            )}
          </StarWrap>
        ))
      )}
      <DeensDefinitions />
    </Stars>
  );
}

// Props Validation
StarsWrap.propTypes = {
  type: PropTypes.oneOf(['default', 'golden', 'yelp']),
  width: PropTypes.number,
  height: PropTypes.number,
  useLogo: PropTypes.bool,
};

StarsWrap.defaultProps = {
  type: 'default',
};
