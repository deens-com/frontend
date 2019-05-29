import React from 'react';
import SvgWithProps from './SvgWithProps';

const PencilIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M9 3.1L6.9 1 1.7 6.2 1 9l2.8-.7L9 3.1zM2.6 6.3l2.9-2.9 1.1 1.1-2.9 2.9-1.1-1.1zm5.3-3.2l-.7.8-1.1-1.1.8-.8 1 1.1zM2.3 7l.7.7L2 8l.3-1z" />
  </svg>
));

export default PencilIcon;
