import Link from 'gatsby-link';
import styled, { css } from 'styled-components'
export const ContentWrap = styled.div`
  padding: 25px;
`;

export const CategoryArrow = styled.span`
  display: block;
  width: 40px;
  padding-top: 3px;
  margin: 0 15px 0 auto;
  transform: translateX(0%);
  transition: transform 0.2s ease-in;
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

export const CartLink = styled(Link)`
  overflow: hidden;
  font-weight: 500;
  color: #3c434b;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
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
  box-shadow: ${props => (props.withShadow ? '0 8px 25px 0 rgba(141, 141, 141, 0.22)' : 'none')};
  transition: box-shadow 0.1s ease-in, background 0.1s ease-in;

  &:hover {
    box-shadow: ${props => (props.withShadow ? '0 8px 40px 0px rgba(141,141,141,0.28)' : 'none')};
    background: ${props => props.hoverBg || 'white'};

    & ${CategoryThumb} img {
      transform: scale(1.05);
    }

    & ${CategoryArrow} {
      transform: translateX(-15%);
    }
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
