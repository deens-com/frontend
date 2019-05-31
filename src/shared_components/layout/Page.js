import React from 'react';
import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 65px);
`;

export const PageWrapper = styled.div`
  max-width: 1350px;
  width: calc(100% - 20px);
  margin: 0 auto;
  position: relative;
`;

export const PageContentStyles = styled.main`
  padding: ${props => props.padding || '0'};
  display: ${props => (props.flex ? 'flex' : 'block')};
`;

export const PageContent = props => {
  return <PageContentStyles {...props}>{props.children}</PageContentStyles>;
};

export const SectionWrap = styled.section`
  margin-bottom: 50px;
`;

export const More = styled.div`
  margin-left: auto;
`;

export const SectionHeader = styled.header`
  margin-bottom: 35px;
  display: flex;
  align-items: center;

  h3 {
    font-size: 24px;
  }

  a {
    color: #65afbb;
    font-weight: 500;
  }
`;

export const SectionContent = styled.div``;
