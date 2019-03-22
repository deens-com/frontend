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

export const UndoArrow = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M13.5,7A6.5,6.5 0 0,1 20,13.5A6.5,6.5 0 0,1 13.5,20H10V18H13.5C16,18 18,16 18,13.5C18,11 16,9 13.5,9H7.83L10.91,12.09L9.5,13.5L4,8L9.5,2.5L10.92,3.91L7.83,7H13.5M6,18H8V20H6V18Z" />
  </svg>
));

export const ArrowIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
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

export const LeftArrow = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M14,7L9,12L14,17V7Z" />
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

export const MinusIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M19,13H5V11H19V13Z" />
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

export const Calendar = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M14.125 1.25H13.375V0H12.125V1.25H3.875V0H2.625V1.25H1.875C0.841125 1.25 0 2.09113 0 3.125V14.125C0 15.1589 0.841125 16 1.875 16H14.125C15.1589 16 16 15.1589 16 14.125V3.125C16 2.09113 15.1589 1.25 14.125 1.25ZM14.75 14.125C14.75 14.4696 14.4696 14.75 14.125 14.75H1.875C1.53038 14.75 1.25 14.4696 1.25 14.125V5.875H14.75V14.125ZM14.75 4.625H1.25V3.125C1.25 2.78038 1.53038 2.5 1.875 2.5H2.625V3.75H3.875V2.5H12.125V3.75H13.375V2.5H14.125C14.4696 2.5 14.75 2.78038 14.75 3.125V4.625Z" />
    <path d="M3.625 7.1875H2.375V8.4375H3.625V7.1875Z" />
    <path d="M6.125 7.1875H4.875V8.4375H6.125V7.1875Z" />
    <path d="M8.625 7.1875H7.375V8.4375H8.625V7.1875Z" />
    <path d="M11.125 7.1875H9.875V8.4375H11.125V7.1875Z" />
    <path d="M13.625 7.1875H12.375V8.4375H13.625V7.1875Z" />
    <path d="M3.625 9.6875H2.375V10.9375H3.625V9.6875Z" />
    <path d="M6.125 9.6875H4.875V10.9375H6.125V9.6875Z" />
    <path d="M8.625 9.6875H7.375V10.9375H8.625V9.6875Z" />
    <path d="M11.125 9.6875H9.875V10.9375H11.125V9.6875Z" />
    <path d="M3.625 12.1875H2.375V13.4375H3.625V12.1875Z" />
    <path d="M6.125 12.1875H4.875V13.4375H6.125V12.1875Z" />
    <path d="M8.625 12.1875H7.375V13.4375H8.625V12.1875Z" />
    <path d="M11.125 12.1875H9.875V13.4375H11.125V12.1875Z" />
    <path d="M13.625 9.6875H12.375V10.9375H13.625V9.6875Z" />
  </svg>
));

export const Map = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z" />
  </svg>
));

export const MapMarker = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
  </svg>
));

export const Camera = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
  </svg>
));

export const Moon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
  </svg>
));

export const SilverWare = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z" />
  </svg>
));

export const Food = SilverWare;

export const RunningPerson = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z" />
  </svg>
));

export const Activity = RunningPerson;

export const Bed = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z" />
  </svg>
));

export const Accommodation = Bed;

export const Pen = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M15.54,3.5L20.5,8.47L19.07,9.88L14.12,4.93L15.54,3.5M3.5,19.78L10,13.31C9.9,13 9.97,12.61 10.23,12.35C10.62,11.96 11.26,11.96 11.65,12.35C12.04,12.75 12.04,13.38 11.65,13.77C11.39,14.03 11,14.1 10.69,14L4.22,20.5L14.83,16.95L18.36,10.59L13.42,5.64L7.05,9.17L3.5,19.78Z" />
  </svg>
));

export const TrashCan = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 12 12"
  >
    <path d="M1.50363 1.5357H2.7903V1.26572C2.7903 0.567797 3.36817 0 4.07844 0H4.92153C5.63181 0 6.20968 0.567797 6.20968 1.26572V1.5357H7.49635C8.32545 1.5357 9 2.19851 9 3.0132V3.38761H0V3.01317C0 2.19851 0.674545 1.5357 1.50363 1.5357ZM3.51582 1.5357H5.48414V1.26572C5.48414 0.960914 5.23175 0.712898 4.92151 0.712898H4.07842C3.7682 0.712898 3.51579 0.960891 3.51579 1.26572V1.5357H3.51582Z" />
    <path d="M8.49609 4.10051V11.275C8.49609 11.6748 8.16509 12 7.75824 12H1.24113C0.834283 12 0.503284 11.6748 0.503284 11.275V4.10051H8.49609ZM5.89428 10.9256H6.61979V5.17488H5.89428V10.9256ZM4.13693 10.9256H4.86245V5.17488H4.13693V10.9256ZM2.37954 10.9256H3.10505V5.17488H2.37954V10.9256Z" />
  </svg>
));

export const CheckIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
  </svg>
));

export const QuestionMarkIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
  </svg>
));

export const Star = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 13 12"
  >
    <path d="M6.71777 0L8.17844 4.58359L12.9053 4.58359L9.08119 7.41641L10.5419 12L6.71777 9.16718L2.89369 12L4.35436 7.41641L0.530273 4.58359L5.2571 4.58359L6.71777 0Z" />
  </svg>
));

export const CopyToClipboard = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
  </svg>
));

export const LinkIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 24 24"
  >
    <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
  </svg>
));

export const Heart = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 24 24"
  >
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
  </svg>
));

export const Drag = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 18 18"
  >
    <circle cx="16" cy="16" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="16" cy="9" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="16" cy="2" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="9" cy="16" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="9" cy="9" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="9" cy="2" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="2" cy="16" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="2" cy="9" r="2" fill="black" fillOpacity="0.15" />
    <circle cx="2" cy="2" r="2" fill="black" fillOpacity="0.15" />
  </svg>
));

export const Car = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 24 24"
  >
    <path d="M16,6H6L1,12V15H3A3,3 0 0,0 6,18A3,3 0 0,0 9,15H15A3,3 0 0,0 18,18A3,3 0 0,0 21,15H23V12C23,10.89 22.11,10 21,10H19L16,6M6.5,7.5H10.5V10H4.5L6.5,7.5M12,7.5H15.5L17.46,10H12V7.5M6,13.5A1.5,1.5 0 0,1 7.5,15A1.5,1.5 0 0,1 6,16.5A1.5,1.5 0 0,1 4.5,15A1.5,1.5 0 0,1 6,13.5M18,13.5A1.5,1.5 0 0,1 19.5,15A1.5,1.5 0 0,1 18,16.5A1.5,1.5 0 0,1 16.5,15A1.5,1.5 0 0,1 18,13.5Z" />
  </svg>
));

export const Walk = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 24 24"
  >
    <path d="M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z" />
  </svg>
));

export const Bike = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 24 24"
  >
    <path d="M5,20.5A3.5,3.5 0 0,1 1.5,17A3.5,3.5 0 0,1 5,13.5A3.5,3.5 0 0,1 8.5,17A3.5,3.5 0 0,1 5,20.5M5,12A5,5 0 0,0 0,17A5,5 0 0,0 5,22A5,5 0 0,0 10,17A5,5 0 0,0 5,12M14.8,10H19V8.2H15.8L13.86,4.93C13.57,4.43 13,4.1 12.4,4.1C11.93,4.1 11.5,4.29 11.2,4.6L7.5,8.29C7.19,8.6 7,9 7,9.5C7,10.13 7.33,10.66 7.85,10.97L11.2,13V18H13V11.5L10.75,9.85L13.07,7.5M19,20.5A3.5,3.5 0 0,1 15.5,17A3.5,3.5 0 0,1 19,13.5A3.5,3.5 0 0,1 22.5,17A3.5,3.5 0 0,1 19,20.5M19,12A5,5 0 0,0 14,17A5,5 0 0,0 19,22A5,5 0 0,0 24,17A5,5 0 0,0 19,12M16,4.8C17,4.8 17.8,4 17.8,3C17.8,2 17,1.2 16,1.2C15,1.2 14.2,2 14.2,3C14.2,4 15,4.8 16,4.8Z" />
  </svg>
));

export const ArrivalFlag = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 19 19"
  >
    <path
      d="M2.35721 18.5222C2.14026 18.5222 1.96436 18.3463 1.96436 18.1294V0.843662C1.96436 0.626707 2.14026 0.450806 2.35721 0.450806C2.57417 0.450806 2.75007 0.626707 2.75007 0.843662V18.1294C2.75007 18.3463 2.57417 18.5222 2.35721 18.5222Z"
      fill="#444444"
    />
    <path d="M6.28571 2.02222H2.75V5.55793H6.28571V2.02222Z" fill="#444444" />
    <path d="M9.82135 2.02222H6.28564V5.55793H9.82135V2.02222Z" fill="#E6E6E6" />
    <path d="M13.357 2.02222H9.82129V5.55793H13.357V2.02222Z" fill="#444444" />
    <path d="M16.8926 2.02222H13.3569V5.55793H16.8926V2.02222Z" fill="#E6E6E6" />
    <path d="M6.28571 5.55786H2.75V9.09357H6.28571V5.55786Z" fill="#E6E6E6" />
    <path d="M9.82135 5.55798H6.28564V9.0937H9.82135V5.55798Z" fill="#444444" />
    <path d="M13.357 5.55798H9.82129V9.09369H13.357V5.55798Z" fill="#E6E6E6" />
    <path d="M16.8926 5.55798H13.3569V9.09369H16.8926V5.55798Z" fill="#444444" />
    <path d="M6.28571 9.09363H2.75V12.6293H6.28571V9.09363Z" fill="#444444" />
    <path d="M9.82135 9.09363H6.28564V12.6293H9.82135V9.09363Z" fill="#E6E6E6" />
    <path d="M13.357 9.09363H9.82129V12.6293H13.357V9.09363Z" fill="#444444" />
    <path d="M16.8926 9.09363H13.3569V12.6293H16.8926V9.09363Z" fill="#E6E6E6" />
  </svg>
));

export const DepartureFlag = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 19 19"
  >
    <path
      d="M15.7143 12.2367H3.14286C2.92589 12.2367 2.75 12.0608 2.75 11.8439V2.41532C2.75 2.19835 2.92589 2.02246 3.14286 2.02246H15.7143C15.9312 2.02246 16.1071 2.19835 16.1071 2.41532V11.8439C16.1071 12.0608 15.9312 12.2367 15.7143 12.2367Z"
      fill="#72C472"
    />
    <path
      d="M3.14286 18.5225C2.9259 18.5225 2.75 18.3466 2.75 18.1296V0.843907C2.75 0.626951 2.9259 0.45105 3.14286 0.45105C3.35981 0.45105 3.53571 0.626951 3.53571 0.843907V18.1296C3.53571 18.3466 3.35981 18.5225 3.14286 18.5225Z"
      fill="#444444"
    />
  </svg>
));

export const Logo = ({ style }) => <img src="/deens-logo.png" width="50%" style={style} alt="" />;
