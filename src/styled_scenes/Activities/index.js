// NPM
import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import TopBar from '../../components/TopBar';
import BrandFooter from '../../components/BrandFooter';

// ACTIONS/CONFIG

// STYLES
import { Page, PageContent } from '../../components/layout/Page';

// MODULE
export default function ActivitiesScene({}) {
  return (
    <Page>
      <TopBar fixed withPadding />
      <PageContent>Content</PageContent>
      <BrandFooter withTopBorder withPadding />
    </Page>
  );
}

// Props Validation
ActivitiesScene.propTypes = {};
