// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS
import back from './HeroSlider/img/back.jpg';

// ACTIONS/CONFIG

// STLYES
const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: calc(-50vw - -50%);
  width: 100vw;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-image: linear-gradient(135deg, rgba(7, 82, 83, 0.23) 0%, rgba(2, 38, 54, 0.65)),
    url(${back});
  background-size: cover;
  background-position: center;
`;

// MODULE
// eslint-disable-next-line
export default function MobileHero({}) {
  return <Wrap />;
}

// Props Validation
MobileHero.propTypes = {};
