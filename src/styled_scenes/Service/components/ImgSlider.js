// NPM
import React, { Component } from 'react';
import styled from 'styled-components';

// COMPONENTS
import { ArrowIcon } from '../../../shared_components/icons';
import Image from 'shared_components/Image';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';

// STYLES
const Wrap = styled.div`
  max-height: 400px;
  margin-bottom: 50px;
  background: #eee;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    max-height: 100%;
    max-width: 100%;
  }

  ${media.minLarge} {
    height: 100vh;
    width: 42vw;
    max-height: 800px;

    img {
      max-height: 100%;
      max-width: fit-content;
    }
  }
`;

const LeftArrow = styled.span`
  border-radius: 50px;
  color: white;
  cursor: pointer;
  display: block;
  font-size: 20px;
  height: 30px;
  left: 35px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scale(1);
  transition: transform 0.15s ease-in;
  width: 30px;
  z-index: 2;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    transform: rotate(180deg);
  }
`;

const RightArrow = styled.span`
  border-radius: 50px;
  color: white;
  cursor: pointer;
  display: block;
  font-size: 20px;
  height: 30px;
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%) scale(1);
  transition: transform 0.15s ease-in;
  width: 30px;
  z-index: 2;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }
`;

// MODULE
export default class FoodImgSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
  }

  goToPrevious() {
    let index;
    if (this.state.index - 1 < 0) {
      index = this.props.images.length - 1;
    } else {
      index = this.state.index - 1;
    }

    this.setState({ index });
  }

  goToNext() {
    let index;
    if (this.state.index + 1 >= this.props.images.length) {
      index = 0;
    } else {
      index = this.state.index + 1;
    }
    this.setState({ index });
  }
  render() {
    return (
      <Wrap>
        {this.props.images &&
          this.props.images.length &&
          this.props.images.length !== 1 && (
            <span>
              <LeftArrow onClick={this.goToPrevious}>
                <ArrowIcon />
              </LeftArrow>
              <RightArrow onClick={this.goToNext}>
                <ArrowIcon />
              </RightArrow>
            </span>
          )}
        <Image
          src={
            (this.props.images &&
              this.props.images.length &&
              this.props.images[this.state.index] &&
              this.props.images[this.state.index].url) ||
            'https://dummyimage.com/600x400/000/fff'
          }
          alt={
            (this.props.images &&
              this.props.images.length &&
              this.props.images[this.state.index] &&
              this.props.images[this.state.index].name) ||
            'missing mainPicture'
          }
          sizes="42vw"
        />
      </Wrap>
    );
  }
}

// Props Validation
FoodImgSlider.propTypes = {};
