import React from 'react';
import { Container } from 'semantic-ui-react';

import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import NewServiceFormContainer from '../containers/NewServiceFormContainer';

const NewServiceScene = props => {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent padding="24px">
        <Container text>
          <h2>Create a new Service</h2>
          <NewServiceFormContainer />
        </Container>
      </PageContent>
    </Page>
  );
};

export default NewServiceScene;
