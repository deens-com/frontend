// NPM
import React, { Component } from 'react';
import styled from 'styled-components';

// COMPONENTS
import ArrowIcon from 'shared_components/icons/ArrowIcon';
import SliderPerson from './SliderPerson';

// ACTIONS/CONFIG
import { resetButton } from '../../../../libs/styled';

// STYLES
const Wrap = styled.div`
  bottom: 0;
  left: calc(-50vw - -50%);
  width: 100vw;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
`;

const BGImage = styled.div`
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.5)),
    url(${props => props.img || '#'});
  background-size: cover;
  background-position: 50% 50%;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
`;

const Arrow = styled.button`
  ${resetButton()};
  align-items: center;
  color: white;
  display: flex;
  font-size: 24px;
  height: 30px;
  opacity: 1;
  outline: none;
  position: absolute;
  top: 50%;
  transition: opacity 0.15s ease-in;
  width: 30px;
  z-index: 2;

  &:hover {
    opacity: 0.75;
  }
`;

const LeftArrow = styled(Arrow)`
  left: 35px;
  transform: translateY(-50%) rotate(180deg);
`;

const RightArrow = styled(Arrow)`
  right: 35px;
  transform: translateY(-50%);
`;

// NOTE: If you update any of the urls in the below array, make sure you also update it in index.html
// where we're pre-fetching all these images
// If you fail to do so, we might load images that may never be used.
// YOU HAVE BEEN WARNED!!
// - @jaydp
export const slider = [
  {
    name: 'NYC Must See',
    location: 'New York City, United States of America',
    avatar: '#',
    image:
      'https://please-com.imgix.net/5ea4f976-6142-4d7e-b342-29b2543963e8.png?auto=compress&q=5&w=1&h=0.5&fit=crop',
    id: '5bc398950ef3aee10fe5ebc0',
  },
  {
    name: 'Romantic and amazing trip in Sydney',
    location: 'Sydney, Australia',
    avatar: '#',
    image:
      'https://please-com.imgix.net/981fabde-0314-409c-a394-36acce1f9b3b.png?auto=compress&q=35&w=1&h=0.5&fit=crop',
    id: '5bc6a5dfacba028138cf594f',
  },
  {
    name: 'London getaway, GB',
    location: 'London, United Kingdom',
    avatar: '#',
    image:
      'https://please-com.imgix.net/58dd1807-a82d-41e1-bcf5-e7c4cf0ec95e.png?auto=compress&q=5&w=1&h=0.5&fit=crop',
    id: '5bc69d8e7dad4cd393e5be7e',
  },
  {
    name: 'The outer San Francisco : From Silicon Valley to Yosemite',
    location: 'San Francisco, United States of America',
    avatar: '#',
    image:
      'https://please-com.imgix.net/3cc53d62-b030-49df-9c02-5a9cbd5025eb.png?auto=compress&q=5&w=1&h=0.5&fit=crop',
    id: '5bc6a9ceacba0224e3cf5950',
  },
];

export default class HeroSlider extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
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

  tick() {
    if (this.state.index < slider.length - 1) {
      this.setState({ index: this.state.index + 1 });
    } else if (this.state.index === slider.length - 1) {
      this.setState({ index: 0 });
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 6000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const currImg = slider[this.state.index];
    return (
      <Wrap>
        <BGImage
          rel="img"
          img={currImg.image}
          aria-label={`${currImg.name}, ${currImg.location}`}
        />
        <LeftArrow onClick={this.goToPrevious}>
          <ArrowIcon />
        </LeftArrow>
        <RightArrow onClick={this.goToNext}>
          <ArrowIcon />
        </RightArrow>
        <SliderPerson
          id={currImg.id}
          name={currImg.name}
          location={currImg.location}
          avatar={currImg.avatar}
        />
      </Wrap>
    );
  }
}

// Props Validation
HeroSlider.propTypes = {};
