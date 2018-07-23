import styled from 'styled-components';
import { resetButton } from '../../../libs/styled';

export const Wrapper = styled.div`
  position: relative;
`;

export const Overlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  top: 12px;
  left: -35px;
  padding: 20px;
  background: white;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  border: 1px solid #eef1f4;
  border-radius: 4px;
  z-index: 1;
`;

export const Button = styled.button`
  ${resetButton({
    border: '1px solid #53B698',
  })};
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 5px;
  border-radius: 34px;
  overflow: hidden;

  svg {
    height: 100%;
    width: 16px;
  }
`;

export const Value = styled.span`
  display: inline-block;
  margin: 0 10px;
`;
