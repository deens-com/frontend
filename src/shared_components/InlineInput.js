import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { primary } from 'libs/colors';
import { PencilIcon } from 'shared_components/icons';

const Text = styled.div`
  display: flex;
  align-items: center;
  > svg {
    margin-left: 15px;
  }
`;

const Input = styled.input`
  color: ${props => props.inputTextColor || 'inherit'};
  max-width: 100%;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  text-align: inherit;
  border-radius: 5px 5px 5px 0;
  border: 0;
  outline: none;
  padding: 0 5px;
  &:focus {
    border-color: ${primary};
    box-shadow: 0 0 10px ${primary};
  }
`;

const InlineInput = ({ children, textPrefix, placeholder, onChanged, inputTextColor, disallowEmptySubmit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const onStartEditing = () => setIsEditing(true);
  const inputEl = useRef(null);

  const onKeyPress = event => {
    if (event.keyCode === 27) {
      setIsEditing(false);
    }

    if (event.keyCode === 13) {
      setIsEditing(false);
      if (event.target.value !== '' || !disallowEmptySubmit) {
        onChanged(event.target.value);
      }
    }
  };

  const onMouseDown = event => {
    if (inputEl.current && !inputEl.current.contains(event.target)) {
      const value = inputEl.current.value;
      setIsEditing(false);
      if (value !== '' || !disallowEmptySubmit) {
        onChanged(value);
      }
    }
  };

  useEffect(
    () => {
      if (isEditing) {
        window.addEventListener('keydown', onKeyPress);
        window.addEventListener('mousedown', onMouseDown);
      } else {
        window.removeEventListener('keydown', onKeyPress);
        window.removeEventListener('mousedown', onMouseDown);
      }
      return () => {
        if (isEditing) {
          window.removeEventListener('keydown', onKeyPress);
          window.removeEventListener('mousedown', onMouseDown);
        }
      };
    },
    [isEditing],
  );

  if (isEditing) {
    const defaultValue = typeof children === 'number' ? children : (children || '') // this is to support 0 as children
    return <Input inputTextColor={inputTextColor} ref={inputEl} autoFocus defaultValue={defaultValue} />
  }

  const child = typeof children === 'number' ? children : (children || placeholder) // this is to support 0 as children

  return (
    <Text onClick={onStartEditing}>
      {textPrefix}
      {child}
      <PencilIcon />
    </Text>
  );
};

InlineInput.propTypes = {
  onChanged: PropTypes.func.isRequired,
  children: PropTypes.string,
  placeholder: PropTypes.string,
  inputTextColor: PropTypes.string,
  textPrefix: PropTypes.string,
  disallowEmptySubmit: PropTypes.bool,
};

InlineInput.defaultProps = {
  children: '',
  placeholder: '',
  inputTextColor: '',
  textPrefix: '',
  disallowEmptySubmit: false,
};

export default InlineInput;
