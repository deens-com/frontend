// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { buildImgUrl } from 'libs/Utils';

// STYLES
const Wrap = styled.div`
  position: relative;

  ${props =>
    props.withTooltip &&
    css`
      &:after {
        border-radius: 17px 17px 17px 0;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        height: calc(100% - 5px);
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

const thumbStyles = `
  background: #f7f7f7;
  background-size: cover;
  background-position: center;
  height: 280px;
  min-width: 100%;
  object-fit: cover;
  border-radius: 0 0 15px 0;
`;

const Thumb = styled.img`
  ${thumbStyles};
`;

const ThumbPlaceholder = styled.div`
  ${thumbStyles};
`;

// MODULE
export default class CartThumb extends Component {
  constructor() {
    super();
    this.state = {
      tooltipVisible: false,
      tagWidth: null,
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
    const { url, withTooltip, isPlaceholder } = this.props;
    return (
      <Wrap isPlaceholder={isPlaceholder} withTooltip={withTooltip} onMouseLeave={this.hideTooltip}>
        {isPlaceholder || !url ? (
          <ThumbPlaceholder />
        ) : (
          <Thumb src={buildImgUrl(url, { width: 400, height: 300 })} width="100%" />
        )}
        {this.props.children}
      </Wrap>
    );
  }
}

// Props Validation
CartThumb.propTypes = {
  url: PropTypes.string.isRequired,
  withTooltip: PropTypes.bool,
};

// Default props
CartThumb.defaultProps = {
  withTooltip: false,
};
