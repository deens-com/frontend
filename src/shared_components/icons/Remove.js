import React from 'react';
import SvgWithProps from './SvgWithProps';

const Remove = SvgWithProps(({ fill, onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 10 10"
    fill="none"
  >
    <circle cx="5" cy="5" r="5" fill={fill} />
    <line x1="2" y1="5" x2="8" y2="5" stroke="white" stroke-width="2" />
  </svg>
));

export default Remove;
