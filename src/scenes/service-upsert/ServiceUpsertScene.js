import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { Page, PageContent } from '../../shared_components/layout/Page';
import TopBar from '../../shared_components/TopBar';
import NewServiceFormContainer from './NewService';
import EditServiceContainer from './EditService';

const NewServiceScene = ({ location }) => {
  const isNewService = location.pathname === '/services/new';
  const isEditService = location.pathname.startsWith('/services/edit/');
  return (
    <Page topPush>
      <TopBar fixed />
      <PageContent padding="24px">
        <Container text>
          {isNewService && (
            <React.Fragment>
              <h2>Add a new service</h2>
              <NewServiceFormContainer />
            </React.Fragment>
          )}
          {isEditService && <EditServiceContainer />}
        </Container>
      </PageContent>
    </Page>
  );
};

NewServiceScene.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

export default withRouter(NewServiceScene);
