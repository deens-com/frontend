import React from 'react';
import SvgWithProps from './SvgWithProps';

const Camera = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    viewBox="0 0 18 16"
  >
    <path
      d="M16.875 3.5H14.0625L12.15 0.575C11.925 0.35 11.5875 0.125 11.25 0.125H6.75C6.4125 0.125 6.075 0.35 5.85 0.575L3.9375 3.5H1.125C0.45 3.5 0 3.95 0 4.625V14.75C0 15.425 0.45 15.875 1.125 15.875H16.875C17.55 15.875 18 15.425 18 14.75V4.625C18 3.95 17.55 3.5 16.875 3.5ZM9 12.5C7.0875 12.5 5.625 11.0375 5.625 9.125C5.625 7.2125 7.0875 5.75 9 5.75C10.9125 5.75 12.375 7.2125 12.375 9.125C12.375 11.0375 10.9125 12.5 9 12.5Z"
      fill="white"
    />
  </svg>
));

export default Camera;
