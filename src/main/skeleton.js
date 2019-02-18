import React from 'react';
import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';

export default ({ children }) => {
  return (
    <Page>
      <TopBar />
      {children}
    </Page>
  );
};
