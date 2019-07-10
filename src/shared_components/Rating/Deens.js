// NPM
import React from 'react';
import Deens from 'shared_components/icons/Deens';
import styled from 'styled-components';

const Wrapper = styled.span`
  ${props =>
    props.type === 'empty' &&
    `
    > svg g:nth-child(2) {
      display: none;
    }
  `} ${props =>
    props.type === 'half' &&
    `
    > svg:nth-child(2) g:nth-child(2) {
      display: none;
    }
  `};
`;

// MODULE
export default function Star({ style, starType }) {
  return (
    <Wrapper type={starType}>
      {starType === 'half' ? (
        <>
          <Deens
            viewBox="-46 0 78 100"
            style={{
              ...style,
              left: -(style.width / 2),
            }}
          />
          <Deens
            viewBox="46 0 78 100"
            style={{
              ...style,
              left: style.width / 2,
            }}
          />
        </>
      ) : (
        <Deens style={style} />
      )}
    </Wrapper>
  );
}

// Props Validation
Star.propTypes = {};
