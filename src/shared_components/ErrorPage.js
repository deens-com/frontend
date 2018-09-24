import React from 'react';
import styled from 'styled-components';
import { Page, PageContent } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import BrandFooter from 'shared_components/BrandFooter';

const Title = styled.h1`
  text-align: center;
  padding-top: 100px;
  margin-bottom: 15px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  align-items: center;
  justify-items: center;
`;

const ErrorPage = () => {
  return (
    <Page topPush>
      <TopBar fixed />
      <PageContent>
        <PageContainer>
          <Title>Something went wrong :-(</Title>
          <p>We are sorry about this, our engineers have been informed about it.</p>
        </PageContainer>
        <BrandFooter />
      </PageContent>
    </Page>
  );
};

export default ErrorPage;
