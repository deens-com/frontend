import React from 'react';
import SvgWithProps from './SvgWithProps';

const Note = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 14 16"
  >
    <path d="M14 6L11 3L8 0H0V16H7.875H10.9375H14V6Z" fill="#FFD600" />
    <path d="M8 6H14L8 0V6Z" fill="#D5A325" />
  </svg>
));

export default Note;
