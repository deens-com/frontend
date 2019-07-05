import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isIosDevice } from 'libs/Utils';
import { primary } from 'libs/colors';
import PencilIcon from 'shared_components/icons/PencilIcon';
import { P } from 'libs/commonStyles';

const Text = styled.div`
  display: inline-flex;
  vertical-align: middle;
  cursor: text;
  align-items: center;
  width: 100%;
  white-space: ${props => (props.wrapLines ? 'pre-wrap' : 'normal')};
  > p {
    line-height: 22px;
  }
  > svg {
    margin-left: 15px;
    flex-shrink: 0;
    ${props =>
      props.iconColor &&
      `
      color: ${props.iconColor};
    `};
  }
`;

const Input = styled.p`
  color: ${props => props.inputTextColor || 'inherit'};
  max-width: 80vw;
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  text-align: inherit;
  border-radius: 5px 5px 5px 0;
  border: 0;
  outline: none;
  padding: ${props => props.padding || '5px'};
  line-height: 22px;
  overflow: hidden;
  &:focus {
    border: 1px solid ${primary};
  }
`;

const InlineInput = ({
  children,
  customWrapper,
  wrapperStyle,
  textPrefix,
  placeholder,
  onChanged,
  inputTextColor,
  disallowEmptySubmit,
  useTextarea,
  autoexpand,
  inputPadding,
  iconColor,
  onFocusChange,
  hideIcon,
  autoselect,
  preventLineBreak,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputEl = useRef(null);
  const textRef = useRef(null);
  const enableEdit = () => {
    setIsEditing(true);
  };
  const disableEdit = () => {
    setIsEditing(false);
  };
  const render = element => {
    if (customWrapper) {
      const Wrap = customWrapper;
      return (
        <Wrap style={wrapperStyle} onClick={enableEdit}>
          {element}
        </Wrap>
      );
    }
    return element;
  };

  const changeValue = useCallback(
    value => {
      onChanged(value);
    },
    [onChanged],
  );

  useEffect(
    () => {
      onFocusChange(isEditing);
    },
    [isEditing, onFocusChange],
  );

  useEffect(
    () => {
      if (!textRef.current) {
        return;
      }
      if (isEditing) {
        textRef.current.focus();
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        const text = textRef.current.childNodes[0];
        if (text) {
          if (autoselect) {
            range.setStart(text, 0);
            range.setEnd(text, text.length);
          } else {
            range.setStart(text, text.length);
          }
        }
      } else {
        textRef.current.blur();
        if (!useTextarea) {
          // beautiful hack to fix keyword search
          const prevWhiteSpace = textRef.current.style.whiteSpace;
          textRef.current.style.height = '1em';
          textRef.current.style.whiteSpace = 'initial';
          setTimeout(() => {
            textRef.current.style.whiteSpace = prevWhiteSpace;
            textRef.current.style.height = 'auto';
          }, 0);
        }
      }
    },
    [isEditing, autoselect, useTextarea],
  );

  const onKeyPress = useCallback(
    event => {
      if (event.keyCode === 27) {
        disableEdit();
      }

      if (event.keyCode === 13) {
        event.preventDefault();
        if (!useTextarea || preventLineBreak) {
          disableEdit();
          if ((event.target && event.target.textContent !== '') || !disallowEmptySubmit) {
            changeValue(event.target.textContent);
          }
        } else {
          const sel = window.getSelection();
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(
            sel.focusNode.length === sel.focusOffset ? '\n\n' : '\n',
          );
          range.insertNode(textNode);
          range.setEndAfter(textNode);
          range.setStartAfter(textNode);
          sel.removeAllRanges();
          sel.addRange(range);
          textRef.current.normalize();
        }
      }
    },
    [changeValue, disallowEmptySubmit, useTextarea, preventLineBreak],
  );

  const onMouseDown = useCallback(
    event => {
      if (inputEl.current && !inputEl.current.contains(event.target)) {
        event.preventDefault();
        const value = textRef.current.textContent;
        disableEdit();
        if (value !== '' || !disallowEmptySubmit) {
          changeValue(value);
        }
      }
    },
    [disallowEmptySubmit, changeValue],
  );

  useEffect(
    () => {
      if (isEditing) {
        window.addEventListener('keydown', onKeyPress);
        window.addEventListener('mousedown', onMouseDown);
        if (isIosDevice) {
          document.body.style.cursor = 'pointer';
        }
      } else {
        window.removeEventListener('keydown', onKeyPress);
        window.removeEventListener('mousedown', onMouseDown);
        if (isIosDevice) {
          document.body.style.cursor = 'initial';
        }
      }
      return () => {
        if (isEditing) {
          window.removeEventListener('keydown', onKeyPress);
          window.removeEventListener('mousedown', onMouseDown);
          if (isIosDevice) {
            document.body.style.cursor = 'initial';
          }
        }
      };
    },
    [isEditing, onMouseDown, onKeyPress],
  );

  const child = typeof children === 'number' ? children : children || ''; // this is to support 0 as children

  return render(
    <Text
      iconColor={iconColor}
      wrapLines={useTextarea}
      onMouseDown={event => {
        if (textRef.current && !textRef.current.contains(event.target)) {
          event.preventDefault();
        }
        enableEdit();
      }}
      ref={inputEl}
    >
      {textPrefix && <P>{textPrefix}</P>}
      {!child && !isEditing && <span style={{ position: 'relative' }}>{placeholder}</span>}
      <Input
        style={{
          whiteSpace: useTextarea ? 'pre-wrap' : 'nowrap',
          textOverflow: isEditing ? 'initial' : 'ellipsis',
        }}
        padding={inputPadding}
        ref={textRef}
        contentEditable={true}
      >
        {child}
      </Input>
      {!hideIcon && <PencilIcon />}
    </Text>,
  );
};

InlineInput.propTypes = {
  onChanged: PropTypes.func.isRequired,
  customWrapper: PropTypes.any,
  onFocusChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  inputTextColor: PropTypes.string,
  textPrefix: PropTypes.string,
  disallowEmptySubmit: PropTypes.bool,
  hideIcon: PropTypes.bool,
  useTextarea: PropTypes.bool,
  autoexpand: PropTypes.bool,
  autoselect: PropTypes.bool,
  preventLineBreak: PropTypes.bool,
  inputPadding: PropTypes.string,
};

InlineInput.defaultProps = {
  customWrapper: null,
  onFocusChange: () => {},
  children: '',
  placeholder: '',
  inputTextColor: '',
  textPrefix: '',
  disallowEmptySubmit: false,
  hideIcon: false,
  useTextarea: false,
  autoexpand: false,
  autoselect: false,
  preventLineBreak: false,
  inputPadding: '0 5px',
};

export default InlineInput;
