import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import Button from 'shared_components/Button';
import { isGDPRDismissed } from 'libs/feature-flags';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  height: 65px;
  display: flex;
  align-items: center;
  bottom: ${props => props.bottom || 0}px;
  justify-content: flex-end;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  background-color: white;
  padding: 0 10px;
  z-index: 5;
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

const FixedFooter = ({ price, peopleNumber, onCustomizeClick, bottom }) => {
  return (
    <Wrapper bottom={bottom}>
      <Text>
        <Sentence>Estimated price for {peopleNumber} people:</Sentence> ${price}
      </Text>
      <div>
        <Button theme="fillLightGreen" size="medium" onClick={onCustomizeClick}>
          Customize this trip
        </Button>
      </div>
    </Wrapper>
  );
};

export default FixedFooter;
