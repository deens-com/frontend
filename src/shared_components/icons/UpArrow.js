import React from 'react';
import SvgWithProps from './SvgWithProps';

const LeftArrow = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 11"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path
      d="M6.00803 0.720748C6.60601 -0.120774 7.85553 -0.120776 8.45351 0.720747L13.5416 7.88114C14.2473 8.87431 13.5372 10.25 12.3188 10.25H2.1427C0.924327 10.25 0.214234 8.87431 0.919964 7.88114L6.00803 0.720748Z"
      fill="#E0E0E0"
    />
  </svg>
));

export default LeftArrow;
