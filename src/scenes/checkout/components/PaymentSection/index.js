import React from 'react';
import { Button, Container, Icon, Label, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import PriceTag from '../../../../shared_components/Currency/PriceTag';

const Wrap = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
`;

const PaymentButton = ({ price }) => (
  <Wrap>
    <div>
      <Button as="div" labelPosition="right">
        <Button color="green">Pay</Button>
        <Label as="a" basic color="green" pointing="left">
          <PriceTag price={price} unit="hidden" />
        </Label>
      </Button>
    </div>
  </Wrap>
);

export default PaymentButton;
