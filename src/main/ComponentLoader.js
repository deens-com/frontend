import React from 'react';
import styled from 'styled-components';
import BrandFooter from 'shared_components/BrandFooter';
import { primary } from 'libs/colors';

const Wrapper = styled.div`
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loader = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  > div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 51px;
    height: 51px;
    margin: 6px;
    border: 6px solid ${primary};
    border-radius: 50%;
    animation: loader-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${primary} transparent transparent transparent;
  }
  > div:nth-child(1) {
    animation-delay: -0.45s;
  }
  > div:nth-child(2) {
    animation-delay: -0.3s;
  }
  > div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes loader-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default props => {
  return (
    <Wrapper>
      <ContentWrapper>
        <Loader>
          <div />
          <div />
          <div />
          <div />
        </Loader>
      </ContentWrapper>
      <BrandFooter />
    </Wrapper>
  );
};
