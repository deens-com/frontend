import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { primary } from 'libs/colors';
import { PencilIcon } from 'shared_components/icons';

const Text = styled.div`
  display: inline-flex;
  cursor: text;
  align-items: center;
  white-space: ${props => (props.wrapLines ? 'pre-wrap' : 'normal')};
  margin: ${props => props.margin};
  > svg {
    margin-left: 15px;
  }
`;

const Input = styled.input`
  color: ${props => props.inputTextColor || 'inherit'};
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  text-align: inherit;
  border-radius: 5px 5px 5px 0;
  border: 0;
  outline: none;
  padding: ${props => props.padding};
  &:focus {
    border-color: ${primary};
    box-shadow: 0 0 10px ${primary};
  }
`;

const Textarea = styled.textarea`
  color: ${props => props.inputTextColor || 'inherit'};
  max-width: 80vw;
  min-height: 100px;
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  text-align: inherit;
  border-radius: 5px 5px 5px 0;
  border: 0;
  outline: none;
  padding: ${props => props.padding};
  &:focus {
    border-color: ${primary};
    box-shadow: 0 0 10px ${primary};
  }
`;

const InlineInput = ({
  children,
  textPrefix,
  placeholder,
  onChanged,
  inputTextColor,
  disallowEmptySubmit,
  useTextarea,
  inputPadding,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const onStartEditing = () => setIsEditing(true);
  const inputEl = useRef(null);

  const onKeyPress = event => {
    if (event.keyCode === 27) {
      setIsEditing(false);
    }

    if (event.keyCode === 13 && !(useTextarea && event.shiftKey)) {
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
    const defaultValue = typeof children === 'number' ? children : children || ''; // this is to support 0 as children
    if (useTextarea) {
      return (
        <Textarea
          padding={inputPadding}
          inputTextColor={inputTextColor}
          ref={inputEl}
          autoFocus
          defaultValue={defaultValue}
        />
      );
    }
    return (
      <Input
        padding={inputPadding}
        inputTextColor={inputTextColor}
        ref={inputEl}
        autoFocus
        defaultValue={defaultValue}
      />
    );
  }

  const child = typeof children === 'number' ? children : children || placeholder; // this is to support 0 as children

  return (
    <Text margin={inputPadding} wrapLines={useTextarea} onClick={onStartEditing}>
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
  useTextarea: PropTypes.bool,
  inputPadding: PropTypes.string,
};

InlineInput.defaultProps = {
  children: '',
  placeholder: '',
  inputTextColor: '',
  textPrefix: '',
  disallowEmptySubmit: false,
  useTextarea: false,
  inputPadding: '0 5px',
};

export default InlineInput;
