import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Label = styled.p`
  color: ${props => props.color};
  position: absolute;
  padding: 5px;
  top: 0px;
  right: 0px;
  background-color: ${props => props.backgroundColor};
  font-size: small;
`;

const Tag = ({ text, backgroundColor, color }) => {
  return (
    <Label backgroundColor={backgroundColor} color={color}>
      {text}
    </Label>
  );
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
};

Tag.defaultProps = {
  backgroundColor: '#f44336',
  color: 'white',
};

export default Tag;
