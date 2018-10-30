import React from 'react';
import styled from 'styled-components';
import { Popup } from 'semantic-ui-react';

const Text = styled.span`
  color: #38d39f;
  font-size: 12px;
  cursor: pointer;
`;

export default CancellationPolicy => (
  <Popup trigger={<Text>Cancellation Policy</Text>} content={'Non-refundable'} on="click" />
);
