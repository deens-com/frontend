// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Image from 'shared_components/Image';

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

const Thumb = styled(Image)`
  padding-top: 65%;
  background: #f7f7f7;
  background-size: cover;
  background-position: center;
  height: 100%;
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
    const { url, withTooltip } = this.props;

    return (
      <Wrap withTooltip={withTooltip} onMouseLeave={this.hideTooltip}>
        <Thumb src={url} background />
        {/*withTooltip && (
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
        )*/}
        {/*withTooltip &&
          tooltipVisible && (
            <Media
              query={`(min-width: ${sizes.large})`}
              render={() => (
                <Tooltip left={this.state.tagWidth + 30}>
                  Part of <Link to="/">{tripCount}</Link> trips
                </Tooltip>
              )}
            />
          )*/}
      </Wrap>
    );
  }
}

// Props Validation
CartThumb.propTypes = {
  url: PropTypes.string.isRequired,
  tripCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withTooltip: PropTypes.bool,
};

// Default props
CartThumb.defaultProps = {
  tripCount: '0',
  withTooltip: false,
};
