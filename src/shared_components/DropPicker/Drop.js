// NPM
import React from "react";
import styled from "styled-components";

// COMPONENTS
import DropItem from "./DropItem";

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  position: absolute;
  right: 107%;
  display: flex;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 4px;
  padding: 5px 10px;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
`;

const BGPin = styled.div`
  position: absolute;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3e%3cpath d='M7 4.7c0-.1-.1-.2-.1-.2L2.9.6v1.9l1.8 1.8.7.7-.7.7-1.8 1.8v1.9l3.9-3.9.2-.2c.1-.2.1-.4 0-.6z' fill='white'/%3e%3cpath d='M2.9 2.5v1.8h1.8zM2.9 5.7v1.8l1.8-1.8zM6.9 5.5c0-.1.1-.2.1-.2s-.1.1-.1.2zM6.9 4.5c0 .1.1.2.1.2s-.1-.1-.1-.2zM5.4 5l-.7-.7H2.9v1.4h1.8z' fill='white'/%3e%3c/svg%3e");
  width: 12px;
  height: 12px;
  top: 50%;
  transform: translateY(-50%);
  right: -8px;
`;

// MODULE
export default function Drop({ children, onToggle }) {
  const modChildren = React.Children.map(children, child => {
    // COMMENT: the second condition is specifically for Gatsby.js problems
    if (child.type === DropItem || child.type === <DropItem />.type) {
      return React.cloneElement(child, {
        onToggle: onToggle
      });
    }
    return null;
  });

  return (
    <Wrap role="menu" tabIndex="-1">
      <BGPin />
      {modChildren}
    </Wrap>
  );
}

// Props Validation
Drop.propTypes = {};
