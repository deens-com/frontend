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
    viewBox="0 0 24 24"
  >
    <path d="M16,6H6L1,12V15H3A3,3 0 0,0 6,18A3,3 0 0,0 9,15H15A3,3 0 0,0 18,18A3,3 0 0,0 21,15H23V12C23,10.89 22.11,10 21,10H19L16,6M6.5,7.5H10.5V10H4.5L6.5,7.5M12,7.5H15.5L17.46,10H12V7.5M6,13.5A1.5,1.5 0 0,1 7.5,15A1.5,1.5 0 0,1 6,16.5A1.5,1.5 0 0,1 4.5,15A1.5,1.5 0 0,1 6,13.5M18,13.5A1.5,1.5 0 0,1 19.5,15A1.5,1.5 0 0,1 18,16.5A1.5,1.5 0 0,1 16.5,15A1.5,1.5 0 0,1 18,13.5Z" />
  </svg>
));

export default Car;
