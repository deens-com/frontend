import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid #ebebeb;
  border-bottom: 1px solid ${props => (props.error ? '#D98181' : '#38d39f')};
  padding: 0 7px;
  border-radius: 5px 5px 0 0;
  flex: 1;
  color: #3c434b;
  display: flex;
  align-items: center;

  &:focus-within {
    border-color: #38d39f;
  }

  input {
    outline: none;
    padding: 10px 7px;
    font-weight: 550;
    border: 0;
    flex: 1;
  }
`;

const Input = styled.input`
  font-size: 14px;
`;

export default ({ error, leftContent, rightContent, children, ...props }) => (
  <Wrapper error={error}>
    {leftContent}
    {children || <Input innerRef={props.innerRef} {...props} />}
    {rightContent}
  </Wrapper>
);
