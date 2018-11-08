// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Person = styled.div`
  align-items: center;
  bottom: 30px;
  display: flex;
  position: absolute;
  right: 35px;
`;

const Content = styled.div`
  color: white;
  margin-right: 15px;
  text-align: right;

  a {
    color: white;
  }

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
export default function SliderPerson({ name, location, id, avatar }) {
  return (
    <Person>
      <Content>
        <Link to={`/trips/${id}`}>
          <span>{name}</span>
        </Link>
        <Link to={`/trips/${id}`}>
          <span>{location}</span>
        </Link>
      </Content>
      {/*<Avatar>
        <Image src={avatar} alt={name} />
      </Avatar>*/}
    </Person>
  );
}

// Props Validation
SliderPerson.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
