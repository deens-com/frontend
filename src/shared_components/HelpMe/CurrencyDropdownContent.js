import React from 'react';
import styled from 'styled-components';
import { primary, primaryHover, textLight } from 'libs/colors';

const Element = styled.div`
  min-width: 200px;
  cursor: pointer;
  padding: 5px 10px;
  color: ${textLight};
  background-color: ${primary};
  &:nth-child(odd) {
    background-color: ${primaryHover};
  }
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
      {key} - {currencies[key]}
    </Element>
  ));
