import styled from 'styled-components';
import { media } from '../../../libs/styled';

export const LeftCol = styled.div`
  width: 100%;

  ${media.minSmall} {
    width: ${props => props.smWidth || '80%'};
    text-align: ${props => props.align || 'left'};
  }

  ${media.minMedium} {
    width: ${props => props.mdWidth || '80%'};
  }
`;

export const RightCol = styled.div`
  width: 100%;

  ${media.minSmall} {
    width: ${props => props.smWidth || '20%'};
    text-align: ${props => props.align || 'left'};
  }

  ${media.minMedium} {
    width: ${props => props.mdWidth || '20%'};
  }
`;

export const Category = styled.span`
  display: block;
  font-size: 14px;
  color: #6e7885;
  text-transform: uppercase;
`;

export const CategoryIcon = styled.span``;
