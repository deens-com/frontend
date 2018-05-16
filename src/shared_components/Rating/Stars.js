// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS
import Star from './Star';

// ACTIONS/CONFIG

// STYLES
const Stars = styled.div`
  margin-right: 5px;
  display: flex;
`;

const StarWrap = styled.div`
  display: inline-block;
  height: 15px;
  width: 14px;
  margin-right: 2px;

  &:last-child {
    margin-right: 0;
  }
`;

// MODULE
export default function StarsWrap({ rating }) {
  return (
    <Stars>
      {Array.apply(null, { length: 5 }).map((e, index) => (
        <StarWrap key={index}>
          <Star style={{ fill: index < Number(rating) ? '#50a18a' : '#d3d7dc' }} />
        </StarWrap>
      ))}
    </Stars>
  );
}

// Props Validation
StarsWrap.propTypes = {};
