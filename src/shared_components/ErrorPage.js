import React, { useEffect } from 'react';
import styled from 'styled-components';
import { PageContent } from 'shared_components/layout/Page';
import BrandFooter from 'shared_components/BrandFooter';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import headerActions from 'store/header/actions';

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

const ErrorPage = ({ changeHeader }) => {
  useEffect(() => {
    changeHeader();
  });
  return (
    <PageContent>
      <PageContainer>
        <Title>Something went wrong :-(</Title>
        <p>We are sorry about this, our engineers have been informed about it.</p>
      </PageContainer>
      <BrandFooter />
    </PageContent>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(ErrorPage);
