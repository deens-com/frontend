import styled, { css } from 'styled-components';

export const ContentWrap = styled.div`
  padding-top: 4px;
`;

export const More = styled.div`
  margin-left: auto;
`;

export const CategoryThumb = styled.div`
  height: 88px;
  overflow: hidden;
  width: 100%;

  img {
    display: block;
    position: relative;
    top: 0;
    height: 100%;
    left: 0;
    width: auto;
    transform: scale(1);
    transition: transform 0.2s ease-in;
  }
`;

export const Cart = styled.div`
  background: ${props => props.background || 'white'};
  border-radius: 15px 15px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  margin-bottom: 15px;
  text-align: ${props => props.centerText || 'left'};
  min-height: ${props => props.height || 'auto'};
  position: relative;

  & > a {
    color: ${props => props.linkColor || 'inherit'};
    text-align: ${props => props.textAlign || 'left'};
  }

  ${props =>
    props.horizontalAlign &&
    css`
      align-items: center;
    `};
`;
