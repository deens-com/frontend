import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import Button from 'shared_components/Button';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  height: 65px;
  display: flex;
  align-items: center;
  bottom: 0;
  justify-content: flex-end;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  background-color: white;
  padding: 0 10px;
  ${media.minSmall} {
    padding-right: 55px;
  }

  button {
    font-size: 12px;
  }
`;

const Text = styled.p`
  color: #3c434b;
  font-size: 16px;
  font-weight: bold;
  margin: auto;
  margin-bottom: 0;
  ${media.minSmall} {
    margin-right: 50px;
  }
`;

const Sentence = styled.span`
  display: block;
  font-size: 10px;
  ${media.minSmall} {
    display: inline-block;
  }
`;

const FixedFooter = ({ price, peopleNumber, onCustomizeClick, startDate, endDate }) => {
  return (
    <Wrapper>
      <Text>
        <Sentence>Estimated price for {peopleNumber} people:</Sentence> ${price}
      </Text>
      <Button
        disabled={!peopleNumber || !(startDate && endDate)}
        theme="fillLightGreen"
        size="medium"
        onClick={onCustomizeClick}
      >
        Customize this trip
      </Button>
    </Wrapper>
  );
};

export default FixedFooter;
