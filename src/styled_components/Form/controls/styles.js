import styled from 'styled-components';
import { placeholderMixin } from '../../../libs/styled';

export const InputControl = styled.input`
  display: inline-block;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  border-radius: 4px;
  background: none;
  padding: 6px 4px 3px;
  width: 100%;
  border: none;
  max-width: 100%;
  outline: none;

  ${placeholderMixin(`
    color: #99a9be;
  `)};
`;
