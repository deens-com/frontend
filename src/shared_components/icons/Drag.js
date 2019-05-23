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

export default Drag;
