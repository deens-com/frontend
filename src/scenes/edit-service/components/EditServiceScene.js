import React from 'react';
import { Container } from 'semantic-ui-react';

import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import EditServiceFormContainer from '../containers/EditServiceFormContainer';

const EditServiceScene = props => {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent padding="24px">
        <Container text>
          <EditServiceFormContainer />
        </Container>
      </PageContent>
    </Page>
  );
};

export default EditServiceScene;
