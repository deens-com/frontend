import React from 'react';
import SvgWithProps from './SvgWithProps';

const DepartureFlag = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 19 19"
  >
    <path
      d="M15.7143 12.2367H3.14286C2.92589 12.2367 2.75 12.0608 2.75 11.8439V2.41532C2.75 2.19835 2.92589 2.02246 3.14286 2.02246H15.7143C15.9312 2.02246 16.1071 2.19835 16.1071 2.41532V11.8439C16.1071 12.0608 15.9312 12.2367 15.7143 12.2367Z"
      fill="#72C472"
    />
    <path
      d="M3.14286 18.5225C2.9259 18.5225 2.75 18.3466 2.75 18.1296V0.843907C2.75 0.626951 2.9259 0.45105 3.14286 0.45105C3.35981 0.45105 3.53571 0.626951 3.53571 0.843907V18.1296C3.53571 18.3466 3.35981 18.5225 3.14286 18.5225Z"
      fill="#444444"
    />
  </svg>
));
export default DepartureFlag;
