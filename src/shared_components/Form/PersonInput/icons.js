import React from 'react';

export const PlusIcon = ({ style }) => (
  <svg viewBox="0 0 24 24" role="img" aria-label="add" focusable="false" style={style}>
    <rect height="2" rx="1" width="12" x="6" y="11" />
    <rect height="12" rx="1" width="2" x="11" y="6" />
  </svg>
);

export const MinusIcon = ({ style }) => (
  <svg viewBox="0 0 24 24" role="img" aria-label="subtract" focusable="false" style={style}>
    <rect height="2" rx="1" width="12" x="6" y="11" />
  </svg>
);
