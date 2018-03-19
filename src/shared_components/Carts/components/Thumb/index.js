// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Media from "react-media";
import Link from "gatsby-link";

// COMPONENTS
import { BagIcon } from "./icons";

// ACTIONS/CONFIG
import { sizes } from "../../../../libs/styled";

// STYLES
const Wrap = styled.div`
  position: relative;

  ${props =>
    props.withTooltip &&
    css`
      &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        height: 100%;
        width: 100%;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.1) 72%,
          rgba(0, 0, 0, 0.3) 100%
        );
      }
    `};
`;

const Thumb = styled.div`
  padding-top: 65%;
  background: #d3d7dc;
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  height: 100%;
`;

const TagWrap = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: #000000;
  border-radius: 8px;
  padding: 5px 10px;
  color: white;
  font-size: 14px;
  display: flex;
  aling-items: center;
  z-index: 2;
  cursor: default;
`;

const IconWrap = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;

  svg {
    fill: #fff;
  }
`;

const CountWrap = styled.span`
  line-height: 1.8;
  font-weight: 500;
`;

const Tooltip = styled.div`
  padding: 9px 13px;
  bottom: 18px;
  font-size: 13px;
  position: absolute;
  background: white;
  border-radius: 4px;
  left: ${props => `${props.left}px`};
  z-index: 3;

  &:before {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 50%;
    left: -8px;
    transform: translateY(-50%) rotate(180deg);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3e%3cpath d='M7 4.7c0-.1-.1-.2-.1-.2L2.9.6v1.9l1.8 1.8.7.7-.7.7-1.8 1.8v1.9l3.9-3.9.2-.2c.1-.2.1-.4 0-.6z' fill='white'/%3e%3cpath d='M2.9 2.5v1.8h1.8zM2.9 5.7v1.8l1.8-1.8zM6.9 5.5c0-.1.1-.2.1-.2s-.1.1-.1.2zM6.9 4.5c0 .1.1.2.1.2s-.1-.1-.1-.2zM5.4 5l-.7-.7H2.9v1.4h1.8z' fill='white'/%3e%3c/svg%3e");
  }

  a {
    color: #4fb798;
  }
`;

// MODULE
export default class CartThumb extends Component {
  constructor() {
    super();
    this.state = {
      tooltipVisible: false,
      tagWidth: null
    };

    this.setTagWidth = this.setTagWidth.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  setTagWidth(width) {
    if (!this.state.tagWidth) {
      this.setState({ tagWidth: width });
    }
  }

  showTooltip() {
    this.setState({ tooltipVisible: true });
  }

  hideTooltip() {
    this.setState({ tooltipVisible: false });
  }

  render() {
    const { tooltipVisible } = this.state;
    const { url, withTooltip, tripCount } = this.props;

    return (
      <Wrap withTooltip={withTooltip} onMouseLeave={this.hideTooltip}>
        <Thumb url={url} />
        {withTooltip && (
          <TagWrap
            innerRef={tag => {
              tag && this.setTagWidth(tag.offsetWidth);
            }}
            onMouseEnter={this.showTooltip}
          >
            <IconWrap>
              <BagIcon />
            </IconWrap>
            <CountWrap>{tripCount}</CountWrap>
          </TagWrap>
        )}
        {withTooltip &&
          tooltipVisible && (
            <Media
              query={`(min-width: ${sizes.large})`}
              render={() => (
                <Tooltip left={this.state.tagWidth + 30}>
                  Part of <Link to="/">{tripCount}</Link> trips
                </Tooltip>
              )}
            />
          )}
      </Wrap>
    );
  }
}

// Props Validation
CartThumb.propTypes = {
  url: PropTypes.string.isRequired,
  tripCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withTooltip: PropTypes.bool
};

// Default props
CartThumb.defaultProps = {
  tripCount: "0",
  withTooltip: false
};
