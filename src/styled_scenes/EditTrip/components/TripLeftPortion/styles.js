import styled from 'styled-components';
import Image from 'shared_components/Image';
import { media } from 'libs/styled';

export const LeftWrap = styled.div`
  width: 100%;

  ${media.minMediumPlus} {
    width: 42%;
  }
`;

export const ShareWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 0;
  color: white;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000);

  ${media.minMedium} {
    min-height: 450px;
    padding: 0;
  }

  h3 {
    text-align: center;
    font-size: 50px;
  }
`;

export const DatesWrap = styled.div`
  margin: 25px 0;
`;

export const ActionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div:first-child {
    margin-bottom: 15px;
  }
`;

export const ShareBg = styled(Image)`
  position: absolute;
  background-size: cover;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

export const MapWrapper = styled.div`
  height: 450px;
  width: 100%;
  background: #5cb89e;
  display: flex;
  align-items: center;
  justify-content: center;

  h3 {
    color: #fff;
    font-size: 52px;
    text-align: center;
    max-width: 400px;
  }
`;

export const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;
