// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Person = styled.div`
  align-items: center;
  bottom: 35px;
  display: flex;
  position: absolute;
  right: 35px;
`;

const Content = styled.div`
  color: white;
  margin-right: 15px;
  text-align: right;

  span {
    display: block;

    &:last-child {
      font-size: 13px;
      margin-top: 6px;
    }
  }
`;

// const Avatar = styled.div`
//   background: #1e1013;
//   border-radius: 30px;
//   border: 2px solid white;
//   height: 30px;
//   overflow: hidden;
//   width: 30px;
// `;

// MODULE
export default function SliderPerson({ name, location, avatar }) {
  return (
    <Person>
      <Content>
        <span>{name}</span>
        <span>{location}</span>
      </Content>
      {/*<Avatar>
        <img src={avatar} alt={name} />
      </Avatar>*/}
    </Person>
  );
}

// Props Validation
SliderPerson.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired
};
