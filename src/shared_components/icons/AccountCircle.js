import React from 'react';
import SvgWithProps from './SvgWithProps';

const AccountCircle = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 12 12"
  >
    <g>
      <circle cx="6" cy="3" r="3" data-color="color-2" />
      <path d="M6,7C2.625,7,1,9.106,1,10.333V11a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-.667C11,9.106,9.375,7,6,7Z" />
    </g>
  </svg>
));

export default AccountCircle;
