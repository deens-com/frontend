import React from 'react';
import styled from 'styled-components';
import { secondary } from 'libs/colors';

const Divisor = styled.span`
  color: ${secondary};
  margin: 0 5px;
`;

export default () => <Divisor>•</Divisor>;
