import React from 'react';

export default function Handle({
  // your handle component
  handle: { id, value, percent },
  getHandleProps,
  children,
}) {
  return (
    <div
      style={{
        top: `${percent}%`,
        position: 'absolute',
        marginLeft: -8,
        marginTop: -8,
        zIndex: 2,
        width: 16,
        height: 16,
        border: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#2C4870',
        color: '#333',
      }}
      {...getHandleProps(id)}
    >
      {children}
    </div>
  );
}
