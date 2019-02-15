// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { lightText, primary, primaryContrast } from 'libs/colors';

// COMPONENTS
import { ArrowIcon } from '../icons';
import { DropArrow, PlusIcon, Camera } from '../icons';

// ACTIONS/CONFIG
import { resetButton } from '../../libs/styled';

// STYLES
const size = {
  text: {
    padding: '0',
    fontSize: '16px',
    iconSize: '12px',
  },
  small: {
    padding: '6px 18px',
    fontSize: '16px',
    iconSize: '12px',
  },
  medium: {
    padding: '12px 28px',
    fontSize: '18px',
    iconSize: '12px',
  },
};

const colors = {
  green: '#4FB798',
  lightGreen: '#38D39F',
  lighterGreen: '#B9FFE7',
  greenActive: '#4ac4a1',
  white: '#fff',
  gray: '#d3d7dc',
  darkRed: '#aa2929',
  red: '#e87878',
};

export const theme = {
  primaryContrastFilled: {
    background: primaryContrast,
    backgroundHover: primary,
    border: primaryContrast,
    borderHover: primary,
    color: lightText,
    colorHover: lightText,
  },
  primaryFilled: {
    background: primary,
    backgroundHover: primaryContrast,
    border: primary,
    borderHover: primaryContrast,
    color: lightText,
    colorHover: lightText,
  },
  white: {
    background: 'transparent',
    backgroundHover: colors.green,
    border: colors.green,
    borderHover: colors.greenActive,
    color: colors.green,
    colorHover: colors.white,
  },
  whiteTransparent: {
    background: 'transparent',
    backgroundHover: colors.green,
    border: colors.green,
    borderHover: colors.greenActive,
    color: colors.white,
    colorHover: colors.white,
  },
  allWhite: {
    background: 'transparent',
    backgroundHover: 'transparent',
    border: colors.white,
    borderHover: colors.greenActive,
    color: colors.white,
    colorHover: colors.greenActive,
  },
  textGreen: {
    background: colors.white,
    backgroundHover: colors.white,
    border: colors.white,
    borderHover: colors.white,
    color: colors.green,
    colorHover: colors.greenActive,
  },
  textLightGreen: {
    background: colors.white,
    backgroundHover: colors.greenActive,
    border: colors.lightGreen,
    borderHover: colors.greenActive,
    color: colors.lightGreen,
    colorHover: colors.white,
  },
  fillLightGreen: {
    background: colors.lightGreen,
    backgroundHover: colors.greenActive,
    border: colors.lightGreen,
    borderHover: colors.greenActive,
    color: colors.white,
    colorHover: colors.white,
  },
  fillLighterGreen: {
    background: colors.lighterGreen,
    backgroundHover: colors.lightGreen,
    border: colors.lighterGreen,
    borderHover: colors.lightGreen,
    color: colors.lightGreen,
    colorHover: colors.white,
  },
  fillLightRed: {
    background: colors.red,
    backgroundHover: colors.darkRed,
    border: colors.red,
    borderHover: colors.darkRed,
    color: colors.darkRed,
    colorHover: colors.white,
  },
  icon: {
    background: 'transparent',
    backgroundHover: 'transparent',
    border: 'transparent',
    borderHover: 'transparent',
    color: colors.gray,
    colorHover: colors.gray,
  },
  danger: {
    background: '#dc3545',
    backgroundHover: '#c82333',
    border: '#dc3545',
    borderHover: '#bd2130',
    color: colors.white,
    colorHover: colors.white,
  },
  disabled: {
    background: '#e0e1e2',
    backgroundHover: '#e0e1e2',
    border: '#e0e1e2',
    borderHover: '#e0e1e2',
    color: 'rgba(0,0,0,0.6)',
    colorHover: 'rgba(0,0,0,0.6)',
  },
};

function getTheme(props) {
  if (props.customTheme) {
    return props.customTheme;
  }

  return theme[props.theme];
}

function calculateBorderRadius(props) {
  if (props.borderRadius) {
    return props.borderRadius;
  }
  return props.round ? '25px' : '5px 5px 5px 0';
}

export const Wrap = styled.div`
  display: inline-block;
  width: ${props => props.width};

  > div,
  > label,
  > button,
  > a {
    border-radius: ${calculateBorderRadius};
    cursor: ${props => (props.theme === 'disabled' ? 'default' : 'pointer')};
    display: inline-block;
    font-size: ${props => props.fontSize || (props.size ? size[props.size].fontSize : 'inherit')};
    height: auto;
    overflow: hidden;
    padding: ${props => {
      if (props.padding) {
        return props.padding;
      }
      return props.size ? size[props.size].padding : '0';
    }};
    text-align: ${props => props.align};
    transition: all 0.1s ease-out;
    font-weight: ${props => (props.bold ? 'bold' : 'normal')};
    width: ${props => props.width};
    ${props =>
      props.align === 'center'
        ? `padding-right: 0;
    padding-left: 0;`
        : ''} svg {
      font-size: ${props => (props.size ? size[props.size].iconSize : '12px')};
    }

    ${props =>
      (props.theme || props.customTheme) &&
      css`
        background: ${getTheme(props).background};
        border: 1px solid ${getTheme(props).border};
        color: ${getTheme(props).color};
        outline: none;

        &:hover,
        &:focus {
          background: ${getTheme(props).backgroundHover};
          border: 1px solid ${getTheme(props).borderHover};
          color: ${getTheme(props).colorHover};

          svg {
            fill: ${getTheme(props).colorHover};
          }
        }
      `};
  }
`;

export const Btn = styled.button`
  ${resetButton()} height: 100%;
`;

export const IconBefore = styled.span`
  margin-right: 5px;
  display: inline-block;
  width: 12px;
  position: relative;
  top: 1px;
`;

export const IconAfter = styled.span`
  margin-left: 5px;
  display: inline-block;
  width: 12px;
  position: relative;
  top: 1px;
`;

// MODULE
export default class Button extends Component {
  constructor() {
    super();
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  getIcon(type) {
    switch (type) {
      case 'arrowDown': {
        return <DropArrow />;
      }
      case 'arrowUp': {
        return <DropArrow style={{ transform: 'rotate(180deg)' }} />;
      }
      case 'arrow': {
        return <ArrowIcon />;
      }
      case 'plus': {
        return <PlusIcon />;
      }
      case 'camera': {
        return <Camera />;
      }
      default:
        return null;
    }
  }

  onClick(ev) {
    // props.disableClick allows to disable the button but keep hover behaviour
    if (this.props.disableClick) {
      return;
    }

    this.props.onClick(ev);
    this.button.blur();
  }

  render() {
    let El;
    if (this.props.element) {
      El = this.props.element;
    } else if (this.props.type === 'link') {
      const props = {
        to: this.props.href,
        href: this.props.href,
        target: this.props.target,
        children: this.props.children,
        rel: this.props.noReferrer && 'noopener noreferrer',
      };
      El = _ => (this.props.external ? <a {...props} /> : <Link {...props} />);
    } else {
      El = props => (
        <Btn
          ref={button => {
            this.button = button;
          }}
          type={this.props.type}
          disabled={this.props.disabled}
          {...props}
          onClick={this.onClick}
        />
      );
    }

    return (
      <Wrap
        theme={this.props.disabled || this.props.disableClick ? 'disabled' : this.props.theme}
        round={this.props.round}
        borderRadius={this.props.borderRadius}
        size={this.props.size}
        padding={this.props.padding}
        align={this.props.align}
        width={this.props.width}
        bold={this.props.bold}
        fontSize={this.props.fontSize}
        customTheme={this.props.customTheme}
      >
        <El {...this.props}>
          {this.props.iconBefore && <IconBefore>{this.getIcon(this.props.iconBefore)}</IconBefore>}
          <span>{this.props.text || this.props.children}</span>
          {this.props.iconAfter && <IconAfter>{this.getIcon(this.props.iconAfter)}</IconAfter>}
        </El>
      </Wrap>
    );
  }
}

// Props Validation
Button.propTypes = {
  type: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(theme)),
  customTheme: PropTypes.shape({
    background: PropTypes.string.isRequired,
    backgroundHover: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    borderHover: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    colorHover: PropTypes.string.isRequired,
  }),
  round: PropTypes.bool,
  size: PropTypes.string,
  align: PropTypes.string,
  width: PropTypes.string,
  iconBefore: PropTypes.string,
  iconAfter: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
  bold: PropTypes.bool,
};

Button.defaultProps = {
  theme: 'primaryContrastFilled',
  type: 'button',
  round: false,
  size: 'small',
  align: 'left',
  width: 'auto',
  iconBefore: '',
  iconAfter: '',
  text: '',
  bold: false,
};
