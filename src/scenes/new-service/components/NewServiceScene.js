import React from 'react';

import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import NewServiceFormContainer from '../containers/NewServiceFormContainer';

const NewServiceScene = props => {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent padding="24px">
        New Service Container
        <NewServiceFormContainer />
      </PageContent>
    </Page>
  );
};

export default NewServiceScene;
