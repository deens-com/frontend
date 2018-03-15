import styled, { css } from 'styled-components';

export const Hr = styled.hr`
  background: #efeff0;
  border: none;
  height: 1px;
  width: 100%;

  ${props =>
    props.withSpacing &&
    css`
      margin: 50px 0;
    `};
`;
