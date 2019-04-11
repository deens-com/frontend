import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import Button from 'shared_components/Button';
import HelpMe from 'shared_components/HelpMe';

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

const FixedFooter = ({
  trip,
  owner,
  session,
  booked,
  price,
  peopleNumber,
  onCustomizeClick,
  bottom,
}) => {
  return (
    <Wrapper bottom={bottom}>
      <Text>
        <Sentence>
          {booked ? 'Paid' : 'Estimated'} price for {peopleNumber} people:
        </Sentence>{' '}
        ${price}
      </Text>
      <HelpMe
        tripParent={trip.parents[0] && trip.parents[0].serviceGroup}
        user={owner}
        isLoadingUser={false}
        session={session}
        buttonSize="medium"
      />
      <div style={{ marginLeft: '15px' }} id="customizeButton">
        <Button theme="fillLightGreen" size="medium" onClick={onCustomizeClick}>
          {booked ? 'Copy this trip' : 'Customize this trip'}
        </Button>
      </div>
    </Wrapper>
  );
};

export default FixedFooter;
