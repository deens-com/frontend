import React from 'react';
import SvgWithProps from './SvgWithProps';

const Drag = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 18 5"
  >
    <circle cx="17" cy="4" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="17" cy="1" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="13" cy="4" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="13" cy="1" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="9" cy="4" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="9" cy="1" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="5" cy="4" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="5" cy="1" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="1" cy="4" r="1" fill="black" fillOpacity="0.15" />
    <circle cx="1" cy="1" r="1" fill="black" fillOpacity="0.15" />
  </svg>
));

export default Drag;
