import styled, { css } from 'styled-components';

import { media } from '../../libs/styled';

export const ContentWrap = styled.div`
  padding: 15px;
  height: ${props => (props.small ? '100px' : '180px')};

  ${media.minSmall} {
    padding: 20px;
  }

  ${media.minMedium} {
    padding: 25px;
  }
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
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  margin-bottom: 15px;
  text-align: ${props => props.centerText || 'left'};
  min-height: ${props => props.height || 'auto'};
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  transition: box-shadow 0.1s ease-in, background 0.1s ease-in;

  &:hover {
    box-shadow: 0 8px 40px 0px rgba(141, 141, 141, 0.28);
    background: ${props => props.hoverBg || 'white'};
  }

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
