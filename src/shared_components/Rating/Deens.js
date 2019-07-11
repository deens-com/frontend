// NPM
import React from 'react';
import Deens from 'shared_components/icons/Deens';
import styled from 'styled-components';

const Wrapper = styled.span`
  ${props =>
    props.type === 'empty' &&
    `
    > svg g:nth-child(3) {
      display: none;
    }
  `} ${props =>
    props.type === 'half' &&
    `
    > svg g:nth-child(3) {
      clip-path: url(#clip3half);
    }
  `};
`;

// MODULE
export default function Star({ style, starType }) {
  return (
    <Wrapper type={starType}>
      <Deens style={style} />
    </Wrapper>
  );
}

// Props Validation
Star.propTypes = {};
