import React from 'react';
import ResultsScene from 'styled_scenes/Results';
import TopBar from 'shared_components/TopBar';

import BrandFooter from 'shared_components/BrandFooter';
import { Page } from 'shared_components/layout/Page';
import ErrorHandler from 'shared_components/ErrorHandler';

const ResultsComponent = props => {
  return (
    <>
      <ErrorHandler
        style={{ fontSize: 22, textAlign: 'center', margin: 'auto' }}
        retryFunction={props.retryFetch}
      >
        <ResultsScene {...props} />
      </ErrorHandler>
      <BrandFooter withTopBorder withPadding posRelative />
    </>
  );
};

export default ResultsComponent;
