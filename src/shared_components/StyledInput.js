import React from 'react';
import styled from 'styled-components';
import { error } from 'libs/colors';

const Wrapper = styled.div`
  border: 1px solid ${props => (props.error ? error : '#ebebeb')};
  padding: 0 7px;
  border-radius: 5px 5px 5px 0;
  background-color: white;
  flex: 1;
  color: #3c434b;
  display: flex;
  align-items: center;
  ${props => props.maxWidth && `max-width: ${props.maxWidth};`} &:focus-within {
    border-color: #097da8;
  }

  input {
    outline: none;
    padding: 10px 7px;
    font-weight: 550;
    border: 0;
    flex: 1;
    max-width: 100%;
  }

  > * {
    outline: none !important;
    border: 0 !important;
    box-shadow: none !important;
  }
`;

const Input = styled.input`
  font-size: 14px;
`;

export default ({
  error,
  wrapperStyle,
  leftContent,
  rightContent,
  children,
  innerRef,
  maxWidth,
  ...props
}) => (
  <Wrapper maxWidth={maxWidth} error={error} style={wrapperStyle}>
    {leftContent}
    {children || <Input ref={innerRef} {...props} />}
    {rightContent}
  </Wrapper>
);
