import React from 'react';
import { Button, Icon, Label, Grid } from 'semantic-ui-react';
import styled from 'styled-components';

const Wrap = styled.div`
  margin-top: 50px;
`;

const PaymentButtons = () => (
  <Wrap>
    <Grid centered>
      <Grid.Row>
        <Button as="div" labelPosition="right">
          <Button color="green">
            <Icon name="dollar" />
            Pay USD
          </Button>
          <Label as="a" basic color="green" pointing="left">
            $2,048
          </Label>
        </Button>
      </Grid.Row>

      <Grid.Row>
        <Button as="div" labelPosition="right">
          <Button color="blue">Pay ETH</Button>
          <Label as="a" basic color="blue" pointing="left">
            2
          </Label>
        </Button>
      </Grid.Row>
    </Grid>
  </Wrap>
);

export default PaymentButtons;
