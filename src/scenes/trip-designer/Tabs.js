import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import { throttle } from 'lodash';
import Icon from 'shared_components/icons/Settings';
import { H4, PXSmall, PStrong } from 'libs/commonStyles';
import { primary, backgroundDark } from 'libs/colors';
import { Loader } from 'semantic-ui-react';
import history from 'main/history';
import { extractPrice } from 'libs/Utils';
import urls from 'libs/urlGenerator';

const Wrapper = styled.nav`
  position: ${props => props.position};
  height: 55px;
  width: 100%;
  z-index: 7;
  display: flex;
  background: white;
  top: 0;
`;

const ElementBase = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  background-color: ${props => (props.selected ? 'white' : backgroundDark)};
  ${props =>
    props.selected &&
    `
    border-bottom: 2px solid ${primary};
  `};
`;

const Placeholder = styled.div`
  margin-top: 30px;
`;

const Element = styled(ElementBase)`
  flex: 1;
  text-align: center;
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SmallElement = styled(ElementBase)`
  padding: 5px;
  flex-direction: column;
`;

export default ({ tripId, trip, isLoading, selected }) => {
  const [position, setPosition] = useState('relative');
  useEffect(
    () => {
      const handleScroll = () => {
        const scrolled = window.scrollY;

        if (scrolled >= 65 && position === 'relative') {
          setPosition('fixed');
          return;
        }

        if (scrolled < 65 && position === 'fixed') {
          setPosition('relative');
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
      {position === 'fixed' && <Placeholder />}
      <Wrapper position={position}>
        <SmallElement
          onClick={() => history.push(urls.trip.settings(tripId))}
          selected={selected === 'settings'}
        >
          <Icon style={{ width: 20, height: 20 }} />
        </SmallElement>
        <Element onClick={() => history.push(urls.trip.organize(tripId))} selected={!selected}>
          <H4>Plan</H4>
        </Element>
        <Element
          onClick={() => history.push(urls.trip.checkout(tripId))}
          selected={selected === 'checkout'}
        >
          <H4>Book</H4>
        </Element>
        {/*<Element onClick={() => history.push(urls.trip.preview(tripId))} selected={selected === 'view'}>
          <H4>View</H4>
        </Element>*/}
        <Element
          onClick={() => history.push(urls.trip.share(tripId))}
          selected={selected === 'share'}
        >
          <H4>Share</H4>
        </Element>
        <SmallElement style={{ background: 'white' }}>
          <PStrong>
            {isLoading || !trip ? (
              <Loader size="mini" inline="centered" active />
            ) : (
              `$${extractPrice(trip.totalPrice)}`
            )}
          </PStrong>
          <PXSmall>Trip Price</PXSmall>
        </SmallElement>
      </Wrapper>
    </>
  );
};
