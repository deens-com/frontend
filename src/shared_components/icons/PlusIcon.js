import React from 'react';
import SvgWithProps from './SvgWithProps';

const PlusIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M5.7 4.3h3c.4 0 .7.3.7.7s-.3.7-.7.7h-3v3c0 .4-.3.7-.7.7s-.7-.3-.7-.7v-3h-3C.9 5.7.5 5.4.5 5s.3-.7.7-.7h3v-3c0-.4.3-.7.7-.7s.7.3.7.7v3z" />
  </svg>
));

export default PlusIcon;
