// NPM
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import BrandFooter from '../../shared_components/BrandFooter';
import { Divider } from 'semantic-ui-react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import headerActions from 'store/header/actions';

// ACTIONS/CONFIG

// STYLES
import { PageContent } from '../../shared_components/layout/Page';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 0px 20px;
`;

// MODULE
// eslint-disable-next-line
function NotFoundScene({ showScene, changeHeader }) {
  useEffect(changeHeader, []);
  const innerElements = (
    <React.Fragment>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
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
  return <PageContent>{innerElements}</PageContent>;
}

// Props Validation
NotFoundScene.propTypes = {
  showScene: PropTypes.bool,
};

NotFoundScene.defaultProps = {
  showScene: true,
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
)(NotFoundScene);
