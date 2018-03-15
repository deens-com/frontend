// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import { BagIcon } from './icons';

// ACTIONS/CONFIG
import { sizes } from '../../../libs/styled';

// STYLES
const Wrap = styled.div`
  position: relative;

  ${props =>
    props.withTooltip &&
    css`
      &:after {
        content: '';
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
      <Wrap withTooltip={withTooltip}>
        <Thumb url={url} />
        {withTooltip && (
          <TagWrap
            innerRef={tag => {
              tag && this.setTagWidth(tag.offsetWidth);
            }}
            onMouseEnter={this.showTooltip}
            onMouseLeave={this.hideTooltip}
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
                <Tooltip left={this.state.tagWidth + 30}>Part of {tripCount} trips</Tooltip>
              )}
            />
          )}
      </Wrap>
    );
  }
}

// Props Validation
CartThumb.propTypes = {};
