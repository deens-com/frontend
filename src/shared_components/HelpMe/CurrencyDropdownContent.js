import React from 'react';
import styled from 'styled-components';
import { disabled } from 'libs/colors';

const Element = styled.div`
  min-width: 325px;
  cursor: pointer;
  padding: 5px 10px;
  background-color: white;
  display: flex;
  font-style: italic;
  &:hover {
    background-color: ${disabled};
  }
`;

const Code = styled.span`
  font-weight: bold;
  width: 45px;
  font-style: normal;
`;

export default ({ closeDropdown, currencies, setCurrency }) =>
  Object.keys(currencies).map(key => (
    <Element
      key={key}
      onClick={() => {
        setCurrency(key);
        closeDropdown();
      }}
    >
      <Code>{key}</Code> {currencies[key]}
    </Element>
  ));
