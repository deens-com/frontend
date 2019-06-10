import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useVoid } from 'libs/hooks';
import { primary } from 'libs/colors';
import PencilIcon from 'shared_components/icons/PencilIcon';
import { P } from 'libs/commonStyles';
import TextArea from 'shared_components/TextArea';

const Text = styled.div`
  display: inline-flex;
  cursor: text;
  align-items: center;
  white-space: ${props => (props.wrapLines ? 'pre-wrap' : 'normal')};
  margin: ${props => props.margin};
  > p {
    line-height: 22px;
  }
  > svg {
    margin-left: 15px;
    ${props =>
      props.iconColor &&
      `
      color: ${props.iconColor};
    `};
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
  line-height: 22px;
  &:focus {
    border: 1px solid ${primary};
  }
`;

const Textarea = styled(TextArea)`
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
  line-height: 22px;
  &:focus {
    border: 1px solid ${primary};
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
  autoexpandTextarea,
  inputPadding,
  iconColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const onStartEditing = () => setIsEditing(true);
  const inputEl = useRef(null);

  const onKeyPress = useCallback(
    event => {
      if (event.keyCode === 27) {
        setIsEditing(false);
      }

      if (event.keyCode === 13 && !useTextarea) {
        setIsEditing(false);
        if (event.target.value !== '' || !disallowEmptySubmit) {
          onChanged(event.target.value);
        }
      }
    },
    [onChanged, disallowEmptySubmit, useTextarea],
  );

  const onMouseDown = useCallback(
    event => {
      event.preventDefault();
      if (inputEl.current && !inputEl.current.contains(event.target)) {
        const value = inputEl.current.value;
        setIsEditing(false);
        if (value !== '' || !disallowEmptySubmit) {
          onChanged(value);
        }
      }
    },
    [disallowEmptySubmit, onChanged],
  );

  const voidFn = useVoid();

  useEffect(
    () => {
      if (isEditing) {
        window.addEventListener('keydown', onKeyPress);
        document.body.addEventListener('click', voidFn);
        window.addEventListener('mousedown', onMouseDown);
      } else {
        window.removeEventListener('keydown', onKeyPress);
        document.body.removeEventListener('click', voidFn);
        window.removeEventListener('mousedown', onMouseDown);
      }
      return () => {
        if (isEditing) {
          window.removeEventListener('keydown', onKeyPress);
          document.body.removeEventListener('click', voidFn);
          window.removeEventListener('mousedown', onMouseDown);
        }
      };
    },
    [isEditing, voidFn, onMouseDown, onKeyPress],
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
          autoexpand={autoexpandTextarea}
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
    <Text
      iconColor={iconColor}
      margin={inputPadding}
      wrapLines={useTextarea}
      onClick={onStartEditing}
    >
      <P>{textPrefix}</P>
      {child}
      <PencilIcon />
    </Text>
  );
};

InlineInput.propTypes = {
  onChanged: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  inputTextColor: PropTypes.string,
  textPrefix: PropTypes.string,
  disallowEmptySubmit: PropTypes.bool,
  useTextarea: PropTypes.bool,
  autoexpandTextarea: PropTypes.bool,
  inputPadding: PropTypes.string,
};

InlineInput.defaultProps = {
  children: '',
  placeholder: '',
  inputTextColor: '',
  textPrefix: '',
  disallowEmptySubmit: false,
  useTextarea: false,
  autoexpandTextarea: false,
  inputPadding: '0 5px',
};

export default InlineInput;
