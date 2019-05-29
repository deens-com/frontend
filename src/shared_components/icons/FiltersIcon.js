import React from 'react';
import SvgWithProps from './SvgWithProps';

const FiltersIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M23,3H12V5H23a1,1,0,0,0,0-2Z" />
    <path d="M1,5H6V8h4V0H6V3H1A1,1,0,0,0,1,5Z" />
    <path d="M23,19H12v2H23a1,1,0,0,0,0-2Z" />
    <path d="M1,21H6v3h4V16H6v3H1a1,1,0,0,0,0,2Z" />
    <path d="M23,11H20v2h3a1,1,0,0,0,0-2Z" />
    <path d="M1,13H14v3h4V8H14v3H1a1,1,0,0,0,0,2Z" />
  </svg>
));

export default FiltersIcon;
