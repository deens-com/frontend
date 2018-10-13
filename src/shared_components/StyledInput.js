import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid #ebebeb;
  border-bottom: 1px solid #38d39f;
  padding: 0 7px;
  border-radius: 5px 5px 0 0;
  flex: 1;
  color: #3c434b;

  &:focus-within {
    border-color: #38d39f;
  }

  input {
    outline: none;
    padding: 8px 7px;
    font-weight: 550;
    border: 0;
  }
`;

const Input = styled.input`
  font-size: 14px;
`;

export default ({ leftContent, rightContent, children, ...props }) => (
  <Wrapper>
    {leftContent}
    {children || <Input props={props} />}
    {rightContent}
  </Wrapper>
);
