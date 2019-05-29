import React from 'react';
import SvgWithProps from './SvgWithProps';

const FilterIcon = SvgWithProps(({ ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
  >
    <path d="M9 1.9H6.3c-.1-.6-.6-1-1.3-1s-1.1.4-1.3 1H1c-.2 0-.3.1-.3.3s.1.3.3.3h2.7c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3s-.1-.3-.3-.3zm-4 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zM9 7.5h-.6c-.1-.6-.6-1-1.3-1s-1.1.4-1.2 1H1c-.2 0-.3.1-.3.3s.1.3.3.3h4.9c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3zm-1.9 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zM9 4.7H4.1c-.1-.6-.6-1-1.3-1s-1.1.4-1.3 1H1c-.2 0-.3.1-.3.3 0 .2.1.3.3.3h.6c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3zm-6.1 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7s.7.3.7.7c0 .4-.3.7-.7.7z" />
  </svg>
));

export default FilterIcon;
