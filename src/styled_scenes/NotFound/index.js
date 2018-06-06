// NPM
import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import TopBar from '../../shared_components/TopBarWithSearch';
import Logo from '../../shared_components/TopBar/Logo';
import BrandFooter from '../../shared_components/BrandFooter';

// ACTIONS/CONFIG

// STYLES
import { Page, PageWrapper, PageContent } from '../../shared_components/layout/Page';
import styled, { css } from 'styled-components';

export const Hr = styled.hr`
  background: #efeff0;
  border: none;
  height: 1px;
  width: 100%;

  ${props =>
    props.withSpacing &&
    css`
      margin: 50px 0;
    `};
`;

// MODULE
// eslint-disable-next-line
export default function NotFoundScene({ showScene }) {
  const innerElements = (
    <React.Fragment>
      <h1
        style={{
          textAlign: 'center',
          marginTop: '100px',
          marginBottom: '15px',
        }}
      >
        404. Not found!
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '150px' }}>
        We are sorry but we could not find the page you are looking for.
      </p>
      <Hr withSpacing />
      <Hr />
      <BrandFooter />
    </React.Fragment>
  );
  if (!showScene) return innerElements;
  return (
    <Page>
      <PageWrapper>
        <TopBar>
          <Logo />
          <span>Links</span>
        </TopBar>
      </PageWrapper>
      <PageContent>
        <PageWrapper>{innerElements}</PageWrapper>
      </PageContent>
    </Page>
  );
}

// Props Validation
NotFoundScene.propTypes = {
  showScene: PropTypes.bool,
};

NotFoundScene.defaultProps = {
  showScene: true,
};
