// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  overflow: hidden;
`;

const Mover = styled.div`
  transform: translateX(0);
  transition: transform 0.4s ease-out;
`;

const Inner = styled.div`
  white-space: nowrap;
`;

const Button = styled.button`
  font-size: inherit;
  font-family: inherit;
  background: transparent;
  border: none;
  outline: none;
  font-size: inherit;
  position: absolute;
  top: 50%;
  background: white;
  padding: 5px;
  transform: translateY(-50%);
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  z-index: 10;
  cursor: pointer;

  ${props =>
    props.position &&
    css`
      ${props.position}: -25px;
    `};
`;

// MODULE
export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: Math.floor(props.items.length / props.show),
      index: 0
    };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
  }

  moveLeft() {
    this.setState({ index: this.state.index - 1 });
  }

  moveRight() {
    this.setState({ index: this.state.index + 1 });
  }

  render() {
    return (
      <Wrap>
        <Mover style={{ transform: `translateX(-${this.state.index * 100}%)` }}>
          <Inner>{this.props.children}</Inner>
        </Mover>
        {this.state.index > 0 && (
          <Button position="left" onClick={this.moveLeft}>
            Left
          </Button>
        )}
        {this.state.index < this.state.pages && (
          <Button position="right" onClick={this.moveRight}>
            Right
          </Button>
        )}
      </Wrap>
    );
  }
}

// Props Validation
Carousel.propTypes = {};
