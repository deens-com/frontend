import React from 'react';
import SvgWithProps from './SvgWithProps';

const LeftArrow = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
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

export default LeftArrow;
