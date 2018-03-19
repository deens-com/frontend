// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import { ArrowIcon } from "../../../../../components/icons";

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  height: 100vh;
  max-height: 800px;
  width: 42%;
  background: #eee;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    height: 100%;
  }
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
export default class FoodImgSlider extends Component {
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
        <LeftArrow onClick={this.goToPrevious}>
          <ArrowIcon />
        </LeftArrow>
        <RightArrow onClick={this.goToNext}>
          <ArrowIcon />
        </RightArrow>
        <img
          src={this.props.images[this.state.index].src}
          alt={this.props.images[this.state.index].label}
        />
      </Wrap>
    );
  }
}

// Props Validation
FoodImgSlider.propTypes = {};
