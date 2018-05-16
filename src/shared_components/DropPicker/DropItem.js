// NPM
import React from "react";
import styled from "styled-components";

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  padding: 5px 10px;
  position: relative;
  cursor: pointer;
  font-size: 14px;

  &:hover,
  &:focus {
    color: #4fb798;
  }

  &:after {
    content: "";
    width: 1px;
    height: 60%;
    background: #eef1f4;
    position: absolute;
    right: 0px;
    top: 20%;
  }

  &:last-child:after {
    display: none;
  }
`;

// MODULE
export default function DropItem({ children, onToggle, onChange }) {
  return (
    <Wrap
      role="menuItem"
      tabIndex="-1"
      onClick={ev => {
        onToggle(ev);
        onChange(ev);
      }}
    >
      {children}
    </Wrap>
  );
}

// Props Validation
DropItem.propTypes = {};
