import React from 'react';
import SvgWithProps from './SvgWithProps';

const Star = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
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

export default Star;
