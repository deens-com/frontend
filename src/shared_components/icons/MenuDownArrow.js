import React from 'react';
import SvgWithProps from './SvgWithProps';

const MenuDownArrow = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M7,10L12,15L17,10H7Z" />
  </svg>
));
export default MenuDownArrow;
