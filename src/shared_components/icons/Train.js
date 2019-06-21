import React from 'react';
import SvgWithProps from './SvgWithProps';

const Car = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 18 20"
  >
    <path d="M15.25 0H2.75C1.375 0 0.25 1.125 0.25 2.5V16.25C0.25 17 0.75 17.5 1.5 17.5V18.75C1.5 19.5 2 20 2.75 20H5.25C6 20 6.5 19.5 6.5 18.75V17.5H11.5V18.75C11.5 19.5 12 20 12.75 20H15.25C16 20 16.5 19.5 16.5 18.75V17.5C17.25 17.5 17.75 17 17.75 16.25V2.5C17.75 1.125 16.625 0 15.25 0ZM4 15C3.25 15 2.75 14.5 2.75 13.75C2.75 13 3.25 12.5 4 12.5C4.75 12.5 5.25 13 5.25 13.75C5.25 14.5 4.75 15 4 15ZM14 15C13.25 15 12.75 14.5 12.75 13.75C12.75 13 13.25 12.5 14 12.5C14.75 12.5 15.25 13 15.25 13.75C15.25 14.5 14.75 15 14 15ZM15.25 10H2.75V2.5H15.25V10Z" />
  </svg>
));

export default Car;
