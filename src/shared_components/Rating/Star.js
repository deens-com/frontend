// NPM
import React from 'react';

// COMPONENTS

// ACTIONS/CONFIG

// MODULE
export default function Star({ style }) {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M17.4 6.8c.7 0 1.3.4 1.5 1.1.2.6 0 1.3-.6 1.7l-3.7 2.7 1.4 4.3c.2.6 0 1.3-.6 1.7-.3.2-.6.3-.9.3-.3 0-.6-.1-.9-.3L10 15.6l-3.7 2.7c-.5.4-1.3.4-1.8 0s-.8-1.1-.5-1.8l1.4-4.3-3.7-2.6c-.6-.4-.8-1.1-.6-1.7.2-.6.8-1.1 1.5-1.1h4.5l1.4-4.3c.2-.7.8-1.1 1.5-1.1s1.3.4 1.5 1.1l1.4 4.3h4.5z" />
    </svg>
  );
}

// Props Validation
Star.propTypes = {};
