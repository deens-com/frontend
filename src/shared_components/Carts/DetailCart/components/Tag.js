import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Label = styled.p`
  color: white;
  position: absolute;
  padding: 5px;
  top: 0px;
  right: 0px;
  background-color: #f44336;
  font-size: small;
`;

const Tag = ({ text }) => {
  return <Label>{text}</Label>;
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Tag;
