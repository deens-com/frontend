import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const SvgWithProps = ComposedComponent => {
  return class SvgProps extends Component {
    static propTypes = {
      ariaHidden: PropTypes.bool,
      focusable: PropTypes.string,
      role: PropTypes.string,
      style: PropTypes.object,
    };
    static defaultProps = {
      ariaHidden: true,
      focusable: 'false',
      role: 'presentation',
      style: {},
    };
    render() {
      const style = {
        height: '1em',
        width: '1em',
        display: 'block',
        fill: 'currentColor',
        ...this.props.style,
      };
      return <ComposedComponent {...this.props} style={style} />;
    }
  };
};

export const ArrowIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M17 10H1c-.6 0-1-.4-1-1s.4-1 1-1h16c.6 0 1 .4 1 1s-.4 1-1 1z" />
    <path d="M11 16c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4L15.6 9l-5.3-5.3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l6 6c.4.4.4 1 0 1.4l-6 6c-.2.2-.4.3-.7.3z" />
  </svg>
));

export const DropArrow = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M5 7.7c-.2 0-.4-.1-.6-.3L1 3.6c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1.1L5 5.8l2.9-3.2c.3-.4.8-.4 1.1-.1.3.3.3.8 0 1.1L5.6 7.4c-.2.2-.4.3-.6.3z" />
  </svg>
));

export const PinIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M3.7 7.7c0 2.4 3.1 7.5 5 10.2.6.9 2 .9 2.6 0 1.8-2.7 5-7.8 5-10.2 0-3.5-2.8-6.3-6.3-6.3S3.7 4.2 3.7 7.7zm8.7-.2c0 1.3-1.1 2.4-2.4 2.4S7.6 8.8 7.6 7.5C7.6 6.1 8.7 5 10 5s2.4 1.1 2.4 2.5z" />
  </svg>
));

export const MicrophoneIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
  </svg>
));

export const SearchIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M12.7 3.6a6.42 6.42 0 0 0-4.6-1.9c-1.7 0-3.3.7-4.6 1.9-1.2 1.2-1.8 2.8-1.8 4.5 0 1.7.7 3.3 1.9 4.6 1.2 1.2 2.8 1.9 4.6 1.9s3.3-.7 4.6-1.9c2.4-2.5 2.4-6.6-.1-9.1zm-.9 8.2c-1 1-2.3 1.5-3.7 1.5-1.4 0-2.7-.5-3.7-1.5S2.9 9.5 2.9 8.1s.5-2.7 1.5-3.7 2.3-1.5 3.7-1.5 2.7.5 3.7 1.5c2 2.1 2 5.4 0 7.4zm6.3 5.4l-3.6-3.6c-.2-.2-.7-.2-.9 0-.2.2-.2.7 0 .9l3.6 3.6c.1.1.3.2.4.2s.3-.1.4-.2c.4-.2.4-.6.1-.9z" />
  </svg>
));

export const CrossIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
  </svg>
));

export const DateIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M17.2 3h-1.3c-.2 0-.4.2-.4.5s.2.5.4.5h1.3c.2 0 .4.2.4.5v2.9H2.3v-3c0-.2.2-.4.5-.4h1.6c.2 0 .4-.2.4-.5S4.6 3 4.4 3H2.8c-.8 0-1.4.7-1.4 1.4v12.7c0 .8.6 1.4 1.3 1.4h14.5c.7 0 1.3-.6 1.3-1.4V4.4c.1-.7-.5-1.4-1.3-1.4zm0 14.6H2.8c-.2 0-.4-.2-.4-.5V8.3h15.4v8.9c-.1.2-.3.4-.6.4zM8.9 4H11c.2 0 .4-.2.4-.5.1-.3-.1-.5-.4-.5H8.9c-.2 0-.4.2-.4.5s.2.5.4.5zM6.6 5.7c.5 0 .9-.4.9-1 0-.4-.2-.7-.5-.8v-2c0-.3-.2-.5-.4-.5s-.4.2-.4.5v2c-.4.2-.6.5-.6.9 0 .5.4.9 1 .9zm6.8 0c.5 0 .9-.4.9-1 0-.4-.2-.7-.5-.8v-2c0-.3-.2-.5-.4-.5s-.4.2-.4.5v2c-.3.2-.5.5-.5.8 0 .6.4 1 .9 1z" />
    <path d="M17.2 18.8H2.8c-.8 0-1.5-.7-1.5-1.6V4.4c0-.9.7-1.6 1.5-1.6h1.6c.3.1.6.3.6.7s-.3.6-.6.6H2.8c-.2 0-.3.1-.3.3v2.8h15V4.4c0-.2-.1-.3-.3-.3h-1.3c-.3 0-.6-.3-.6-.6s.3-.6.6-.6h1.3c.8 0 1.5.7 1.5 1.6v12.7c.1.8-.6 1.6-1.5 1.6zM2.8 3.2c-.6 0-1.2.6-1.2 1.2v12.7c0 .7.5 1.2 1.2 1.2h14.5c.6 0 1.2-.6 1.2-1.2V4.4c0-.7-.5-1.2-1.2-1.2H16c-.2 0-.3.1-.3.3 0 .2.1.3.3.3h1.3c.3 0 .6.3.6.6v3.1H2.1V4.4c0-.4.3-.6.6-.6h1.6c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H2.8zm14.4 14.6H2.8c-.3 0-.6-.3-.6-.6v-9h15.7v9c0 .3-.3.6-.7.6zM2.5 8.5v8.7c0 .2.1.3.3.3h14.5c.2 0 .3-.1.3-.3V8.5H2.5zm10.9-2.6c-.6 0-1.1-.5-1.1-1.1 0-.4.2-.7.5-.9v-2c0-.4.3-.6.6-.6s.6.3.6.6v1.9c.3.2.5.6.5.9 0 .7-.5 1.2-1.1 1.2zm0-4.3c-.2 0-.3.1-.3.3V4l-.1.1c-.2.1-.4.4-.4.7 0 .4.3.8.8.8s.8-.4.8-.8c0-.3-.2-.6-.4-.7l-.1-.1V1.9c0-.2-.1-.3-.3-.3zM6.6 5.9c-.6 0-1.1-.5-1.1-1.1 0-.4.2-.7.5-.9v-2c0-.4.3-.6.6-.6s.6.3.6.6v1.9c.3.2.5.6.5 1 0 .6-.5 1.1-1.1 1.1zm0-4.3c-.2 0-.3.1-.3.3V4l-.1.1c-.2.1-.4.4-.4.7 0 .4.3.8.8.8s.8-.4.8-.8c0-.3-.2-.6-.4-.7L6.8 4V1.9c0-.2-.1-.3-.2-.3zM11 4.1H8.9c-.3 0-.6-.3-.6-.6s.3-.6.6-.6H11c.3 0 .6.3.6.6s-.2.6-.6.6zm-2.1-.9c-.2 0-.3.1-.3.3 0 .2.1.3.3.3H11c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H8.9z" />
  </svg>
));

export const PersonIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M17 18.2c0 .5-.3.8-.8.8-.4 0-.8-.4-.8-.8 0-3.2-2.4-5.7-5.4-5.7s-5.4 2.6-5.4 5.7c0 .5-.3.8-.8.8-.4 0-.8-.4-.8-.8 0-4.1 3.1-7.4 7-7.4s7 3.3 7 7.4zM10 10c-2.4 0-4.3-2-4.3-4.5S7.6 1 10 1s4.3 2 4.3 4.5S12.4 10 10 10zm0-1.6c1.5 0 2.7-1.3 2.7-2.9S11.5 2.6 10 2.6 7.3 3.9 7.3 5.5 8.5 8.4 10 8.4z" />
  </svg>
));

export const PlusIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M5.7 4.3h3c.4 0 .7.3.7.7s-.3.7-.7.7h-3v3c0 .4-.3.7-.7.7s-.7-.3-.7-.7v-3h-3C.9 5.7.5 5.4.5 5s.3-.7.7-.7h3v-3c0-.4.3-.7.7-.7s.7.3.7.7v3z" />
  </svg>
));

export const PencilIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M9 3.1L6.9 1 1.7 6.2 1 9l2.8-.7L9 3.1zM2.6 6.3l2.9-2.9 1.1 1.1-2.9 2.9-1.1-1.1zm5.3-3.2l-.7.8-1.1-1.1.8-.8 1 1.1zM2.3 7l.7.7L2 8l.3-1z" />
  </svg>
));

export const FilterIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M9 1.9H6.3c-.1-.6-.6-1-1.3-1s-1.1.4-1.3 1H1c-.2 0-.3.1-.3.3s.1.3.3.3h2.7c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3s-.1-.3-.3-.3zm-4 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zM9 7.5h-.6c-.1-.6-.6-1-1.3-1s-1.1.4-1.2 1H1c-.2 0-.3.1-.3.3s.1.3.3.3h4.9c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3zm-1.9 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zM9 4.7H4.1c-.1-.6-.6-1-1.3-1s-1.1.4-1.3 1H1c-.2 0-.3.1-.3.3 0 .2.1.3.3.3h.6c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3zm-6.1 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7s.7.3.7.7c0 .4-.3.7-.7.7z" />
  </svg>
));

export const Menu = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
  </svg>
));

// My stuff icons

export const Briefcase = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
  </svg>
));

export const Folder = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
  </svg>
));

export const AccountCircle = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
  </svg>
));

export const Settings = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
  </svg>
));

export const Logo = ({ style }) => <img src="/please-logo.svg" width="90%" style={style} alt="" />;
