import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  height: 65px;
  display: flex;
  align-items: center;
  bottom: 0;
  justify-content: flex-end;
  padding-right: 55px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  background-color: white;
`;

const Text = styled.span`
  color: #3c434b;
  font-size: 16px;
  font-weight: bold;
  margin-right: 50px;
`;

const FixedFooter = ({ price, peopleNumber }) => {
  return (
    <Wrapper>
      <Text>
        Maximum price for {peopleNumber} Persons: ${price}
      </Text>
      <Button theme="fillLightGreen" size="medium">
        Customize this trip
      </Button>
    </Wrapper>
  );
};

export default FixedFooter;
