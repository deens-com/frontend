// NPM
import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import TopBar from '../../shared_components/TopBarWithSearch';
import Logo from '../../shared_components/TopBar/Logo';
import BrandFooter from '../../shared_components/BrandFooter';
import { Divider } from 'semantic-ui-react';
// ACTIONS/CONFIG

// STYLES
import { Page, PageContent } from '../../shared_components/layout/Page';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 0px 20px;
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
      <FooterWrapper>
        <Divider />
        <BrandFooter />
      </FooterWrapper>
    </React.Fragment>
  );

  if (!showScene) return innerElements;
  return (
    <Page>
      <TopBar>
        <Logo />
        <span>Links</span>
      </TopBar>
      <PageContent>{innerElements}</PageContent>
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
