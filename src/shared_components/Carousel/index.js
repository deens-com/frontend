// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

// COMPONENTS
import { ArrowIcon } from "../icons";
import Row from "../layout/Row";

// ACTIONS/CONFIG
import { resetButton, media } from "../../libs/styled";

// STYLES
const carouselSizes = {
  medium: {
    overflowPadding: "0",
    overflowMargin: "0",
    cornerWidth: "45px",
    cornerPosition: "-50px",
    btnSize: "48px",
    svgSize: "20px"
  },
  small: {
    overflowPadding: "25px 15px",
    overflowMargin: "-25px -15px",
    cornerWidth: "15px",
    cornerPosition: "-15px",
    btnSize: "28px",
    svgSize: "12px"
  }
};

const Wrap = styled(Row)`
  position: relative;
`;

const Overflow = styled.div`
  overflow: hidden;

  ${media.minSmall} {
    ${props =>
      props.shadowInside &&
      css`
        padding: ${carouselSizes[props.size].overflowPadding};
        margin: ${carouselSizes[props.size].overflowMargin};
      `};
  }

  &:before,
  &:after {
    content: "";
    display: none;
    width: ${props => carouselSizes[props.size].cornerWidth};
    height: 100%;
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    transition: background 0.1s;

    ${media.minLarge} {
      display: block;
    }
  }

  &:before {
    left: ${props => carouselSizes[props.size].cornerPosition};
    background: white;
  }

  &:after {
    right: ${props => carouselSizes[props.size].cornerPosition};
    background: white;
  }

  ${props =>
    props.inTransition &&
    css`
      &:before {
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 1) 50%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      &:after {
        background: linear-gradient(
          to left,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 1) 50%,
          rgba(255, 255, 255, 0) 100%
        );
      }
    `};
`;

const Mover = styled.div`
  transform: translateX(0);
  transition: transform 0.4s ease-out;
`;

const Inner = styled.div`
  white-space: nowrap;
`;

const Loader = styled.span`
  display: inline-block;
  position: absolute;
  top: 50%;
  width: ${props => props.width + "%"};
  text-align: center;
  transform: translate(0%, -50%);
`;

const Button = styled.button`
  ${resetButton()};
  align-items: center;
  background: white;
  border-radius: ${props => carouselSizes[props.size].btnSize};
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  height: ${props => carouselSizes[props.size].btnSize};
  justify-content: center;
  outline: none;
  position: absolute;
  top: 48%;
  transform: translateY(-50%);
  width: ${props => carouselSizes[props.size].btnSize};
  z-index: 10;
  color: #50a18a;

  ${props =>
    props.position &&
    css`
      ${props.position}: ${props.size === "small" ? "-5px" : "-25px"};
    `};
`;

const ButtonLeft = Button.extend`
  left: 0px;

  ${media.minLarge} {
    left: ${props => (props.size === "small" ? "-5px" : "-25px")};
  }

  svg {
    transform: rotate(180deg);
  }
`;

const ButtonRight = Button.extend`
  right: 0px;

  ${media.minLarge} {
    right: ${props => (props.size === "small" ? "-5px" : "-25px")};
  }
`;

// MODULE
export default class Carousel extends Component {
  constructor(props) {
    super(props);
    const propsPages = Math.ceil(props.length / Number(props.show));
    const remainingEls = props.length % Number(props.show);
    const pages =
      props.withLoader && remainingEls === 0 ? propsPages + 1 : propsPages;

    this.state = {
      pages: pages,
      index: 1,
      inTransition: false
    };

    this.resetTransition = this.resetTransition.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
  }

  resetTransition() {
    setTimeout(() => {
      this.setState({ inTransition: false });
    }, 200);
  }

  moveLeft() {
    this.setState({ index: this.state.index - 1, inTransition: true });
    this.resetTransition();
  }

  moveRight() {
    this.setState({ index: this.state.index + 1, inTransition: true });
    this.resetTransition();
  }

  render() {
    const modChildren = React.Children.map(
      this.props.children,
      (child, index) => {
        const childPageIndex = Math.ceil((index + 1) / this.props.show);
        if (!this.state.inTransition && childPageIndex !== this.state.index) {
          return React.cloneElement(child, {
            withShadow: false
          });
        }
        return child;
      }
    );

    return (
      <Wrap shadowInside={this.props.shadowInside}>
        <Overflow
          inTransition={this.state.inTransition}
          shadowInside={this.props.shadowInside}
          size={this.props.size}
        >
          <Mover
            style={{
              transform: `translateX(-${this.state.index * 100 - 100}%)`
            }}
          >
            <Inner>
              {modChildren}
              {this.props.withLoader && (
                <Loader
                  width={(100 / Number(this.props.show)).toFixed(2)}
                  offset={this.props.length % Number(this.props.show)}
                >
                  Load more...
                </Loader>
              )}
            </Inner>
          </Mover>
        </Overflow>
        {this.state.index > 1 && (
          <ButtonLeft
            position="left"
            onClick={this.moveLeft}
            size={this.props.size}
          >
            <ArrowIcon
              style={{
                fill: "#50a18a",
                transform: "rotate(180deg)",
                top: "-1px"
              }}
            />
          </ButtonLeft>
        )}
        {this.state.index < this.state.pages && (
          <ButtonRight
            position="right"
            onClick={this.moveRight}
            size={this.props.size}
          >
            <ArrowIcon style={{ fill: "#50a18a" }} />
          </ButtonRight>
        )}
      </Wrap>
    );
  }
}

// Props Validation
Carousel.propTypes = {
  show: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  shadowInside: PropTypes.bool,
  withLoader: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

// Default props
Carousel.defaultProps = {
  size: "medium",
  shadowInside: false,
  withLoader: false
};
