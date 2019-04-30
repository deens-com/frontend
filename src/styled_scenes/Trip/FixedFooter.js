import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import Button from 'shared_components/Button';
import HelpMe from 'shared_components/HelpMe';
import throttle from 'lodash.throttle';

const bottomOffset = 245;

const Wrapper = styled.div`
  width: 100%;
  position: ${props => props.position};
  height: 65px;
  display: flex;
  align-items: center;
  bottom: 0;
  justify-content: flex-end;
  box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.2);
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

const Placeholder = styled.div`
  height: 65px;
`;

const FixedFooter = ({ trip, owner, session, booked, price, peopleNumber, onCustomizeClick }) => {
  const [position, setPosition] = useState('fixed');
  useEffect(
    () => {
      const handleScroll = () => {
        const fullHeight = document.body.scrollHeight;
        const scrolled = window.scrollY;
        const viewportHeight = window.innerHeight;

        if (scrolled + viewportHeight >= fullHeight - bottomOffset) {
          setPosition('relative');
          return;
        }

        if (position === 'relative') {
          setPosition('fixed');
        }
      };

      const handleScrollThrottle = throttle(handleScroll, 10);

      window.addEventListener('scroll', handleScrollThrottle);
      return () => {
        window.removeEventListener('scroll', handleScrollThrottle);
      };
    },
    [position],
  );
  return (
    <>
      <Wrapper position={position}>
        <Text>
          <Sentence>
            {booked ? 'Paid' : 'Estimated'} price for {peopleNumber} people:
          </Sentence>{' '}
          ${price}
        </Text>
        <HelpMe
          tripId={trip._id}
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
      {position === 'fixed' && <Placeholder />}
    </>
  );
};

export default FixedFooter;
