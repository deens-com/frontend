// NPM
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

// COMPONENTS
import Stars from './Stars';

// ACTIONS/CONFIG

// STYLES
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${props =>
    props.marginBottom &&
    css`
      margin-bottom: ${props.marginBottom};
    `};
`;

const Count = styled.span`
  font-size: 14px;
  color: #3c434b;
  position: relative;
  top: 0.1em;
`;

// MODULE
export default function Rating({ rating, count, marginBottom, starsType }) {
  return (
    <Wrapper marginBottom={marginBottom}>
      <Stars rating={rating} type={starsType} />
      {count > 1 && <Count>({count})</Count>}
    </Wrapper>
  );
}

// Props Validation
Rating.propTypes = {
  starsType: PropTypes.oneOf(['default', 'golden', 'yelp']),
};

Rating.defaultProps = {
  starsType: 'default',
};
