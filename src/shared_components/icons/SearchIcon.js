import React from 'react';
import SvgWithProps from './SvgWithProps';

const SearchIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M12.7 3.6a6.42 6.42 0 0 0-4.6-1.9c-1.7 0-3.3.7-4.6 1.9-1.2 1.2-1.8 2.8-1.8 4.5 0 1.7.7 3.3 1.9 4.6 1.2 1.2 2.8 1.9 4.6 1.9s3.3-.7 4.6-1.9c2.4-2.5 2.4-6.6-.1-9.1zm-.9 8.2c-1 1-2.3 1.5-3.7 1.5-1.4 0-2.7-.5-3.7-1.5S2.9 9.5 2.9 8.1s.5-2.7 1.5-3.7 2.3-1.5 3.7-1.5 2.7.5 3.7 1.5c2 2.1 2 5.4 0 7.4zm6.3 5.4l-3.6-3.6c-.2-.2-.7-.2-.9 0-.2.2-.2.7 0 .9l3.6 3.6c.1.1.3.2.4.2s.3-.1.4-.2c.4-.2.4-.6.1-.9z" />
  </svg>
));

export default SearchIcon;
