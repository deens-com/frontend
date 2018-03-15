// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import back from '../img/back.jpg';
import jump from '../img/jump.jpg';
import mountain from '../img/mountain.jpg';
import { Arrow } from '../../../styled_components/icons';
import SliderPerson from './SliderPerson';

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-image: linear-gradient(176deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0.72)),
    url(${props => props.img || '#'});
  background-size: cover;
`;

const LeftArrow = styled.span`
  display: block;
  border-radius: 50px;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 35px;
  top: 50%;
  transform: translateY(-50%) scale(1);
  cursor: pointer;
  z-index: 2;
  transition: transform 0.15s ease-in;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    fill: white;
    transform: rotate(180deg);
  }
`;

const RightArrow = styled.span`
  display: block;
  border-radius: 50px;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%) scale(1);
  cursor: pointer;
  z-index: 2;
  transition: transform 0.15s ease-in;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    fill: white;
  }
`;

// MODULE
const slider = [
  { name: 'Rock diving', location: 'Bali, Indonesia', avatar: '#', image: back },
  { name: 'Sky diving', location: 'Chaing Mai, Thailand', avatar: '#', image: jump },
  { name: 'Cycling', location: 'Patagonia, Chile', avatar: '#', image: mountain }
];

export default class HeroSlider extends Component {
  constructor() {
    super();
    this.state = {
      index: 0
    };

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
  }

  goToPrevious() {
    let index;
    if (this.state.index - 1 < 0) {
      index = slider.length - 1;
    } else {
      index = this.state.index - 1;
    }

    this.setState({ index });
  }

  goToNext() {
    let index;
    if (this.state.index + 1 >= slider.length) {
      index = 0;
    } else {
      index = this.state.index + 1;
    }
    this.setState({ index });
  }

  render() {
    return (
      <Wrap img={slider[this.state.index].image}>
        <LeftArrow onClick={this.goToPrevious}>
          <Arrow />
        </LeftArrow>
        <RightArrow onClick={this.goToNext}>
          <Arrow />
        </RightArrow>
        <SliderPerson
          name={slider[this.state.index].name}
          location={slider[this.state.index].location}
          avatar={slider[this.state.index].avatar}
        />
      </Wrap>
    );
  }
}

// Props Validation
HeroSlider.propTypes = {};
