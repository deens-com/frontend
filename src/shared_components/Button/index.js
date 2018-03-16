// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Link from 'gatsby-link';

// COMPONENTS

// ACTIONS/CONFIG
import { resetButton } from '../../libs/styled';

// STYLES
const size = {
  text: {
    padding: '0',
    fontSize: '16px'
  },
  small: {
    padding: '6px 18px',
    fontSize: '16px'
  },
  medium: {
    padding: '12px 28px',
    fontSize: '18px'
  }
};

const Wrap = styled.div`
  display: inline-block;

  > button,
  > a {
    display: inline-block;
    border-radius: ${props => (props.round ? '25px' : '0')};
    box-shadow: ${props => (props.withShadow ? '0 8px 25px 0 rgba(141, 141, 141, 0.22)' : 'none')};
    cursor: pointer;
    overflow: hidden;
    padding: ${props => (props.size ? size[props.size].padding : '0')};
    font-size: ${props => (props.size ? size[props.size].fontSize : 'inherit')};
    text-align: ${props => props.align || 'left'};
    transition: all 0.1s ease-out;
    width: ${props => props.width || '100%'};

    svg {
      transition: fill 0.1s ease-out;
    }

    ${props =>
      props.theme &&
      css`
        background: ${props.theme.background || 'transparent'};
        border: 1px solid ${props.theme.border || 'transparent'};
        color: ${props.theme.color || 'inherit'};
        outline: none;

        svg {
          fill: ${props.theme.color || '#3c434b'};
        }

        &:hover,
        &:focus {
          background: ${props.theme.backgroundHover || 'inherit'};
          border: 1px solid ${props.theme.borderHover || 'inherit'};
          color: ${props.theme.colorHover || 'inherit'};

          svg {
            fill: ${props.theme.colorHover || '#3c434b'};
          }
        }
      `};
  }
`;

const Btn = styled.button`
  ${resetButton()} height: 100%;
`;

const IconBefore = styled.span`
  margin-right: 10px;
`;

const IconAfter = styled.span`
  margin-left: 10px;
`;

const ButtonLink = Btn.withComponent(Link);

// MODULE
export default class Button extends Component {
  constructor() {
    super();
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  getIcon(type) {
    return 'y';
  }

  onClick(ev) {
    this.props.onClick(ev);
    this.button.blur();
  }

  render() {
    let El;
    if (this.props.type === 'link') {
      El = props => (
        <Link to={this.props.href} target={this.props.target} children={this.props.children} />
      );
    } else {
      El = props => (
        <Btn
          innerRef={button => {
            this.button = button;
          }}
          type={this.props.type}
          onClick={this.onClick}
          {...props}
        />
      );
    }

    return (
      <Wrap
        theme={this.props.theme}
        round={this.props.round}
        size={this.props.size}
        align={this.props.align}
        width={this.props.width}
      >
        <El>
          {this.props.iconBefore && <IconBefore>{this.getIcon(this.props.iconBefore)}</IconBefore>}
          <span>{this.props.text || this.props.children}</span>
          {this.props.iconAfter && <IconAfter>{this.getIcon(this.props.iconAfter)}</IconAfter>}
        </El>
      </Wrap>
    );
  }
}

// Props Validation
Button.propTypes = {};
