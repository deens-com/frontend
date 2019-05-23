import React from 'react';
import SvgWithProps from './SvgWithProps';

const DropArrow = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
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
export default DropArrow;
