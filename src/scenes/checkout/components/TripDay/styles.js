import styled from 'styled-components';
import { media } from '../../../../libs/styled';

export const Wrap = styled.div`
  margin-bottom: 50px;
`;

export const Header = styled.div`
  margin: 0 -10px 25px;

  h4 {
    font-size: 24px;
    margin-right: auto;
  }

  ${media.minSmall} {
    margin: 0 0 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const DayTitle = styled.h4`
  margin-bottom: 15px;
  padding-left: 15px;

  ${media.minSmall} {
    padding-left: 0;
    margin-bottom: 0;
  }
`;

export const DayTag = styled.span`
  margin-right: 10px;
`;

export const Mute = styled.span`
  color: #d3d7dc;
  font-weight: 300;
`;
