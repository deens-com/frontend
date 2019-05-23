import React from 'react';
import SvgWithProps from './SvgWithProps';

const MinusIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
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

export default MinusIcon;
