import React from 'react';
import styled from 'styled-components';
import { primary } from 'libs/colors';
import PlusIcon from 'shared_components/icons/PlusIcon';
import { media } from 'libs/styled';

const Button = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 5px 5px 5px 0;
  background-color: ${primary};
  color: white;
  border: 0;
  outline: none;
  cursor: pointer;
  > svg {
    margin: auto;
    width: 18px !important;
    height: 18px !important;
  }
  ${media.minLargePlus} {
    width: 48px;
    height: 48px;
  }
`;

export default () => {
  return (
    <Button>
      <PlusIcon />
    </Button>
  );
};
