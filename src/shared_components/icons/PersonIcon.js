import React from 'react';
import SvgWithProps from './SvgWithProps';

const PersonIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
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

export default PersonIcon;
