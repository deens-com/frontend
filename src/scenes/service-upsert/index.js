import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import headerActions from 'store/header/actions';

import { Page, PageContent } from '../../shared_components/layout/Page';
import TopBar from '../../shared_components/TopBar';
import NewServiceFormContainer from './NewService';
import EditServiceContainer from './EditService';

// i18n
import { I18n } from '@lingui/react';
import { Trans } from '@lingui/macro';

const NewServiceScene = ({ location, changeHeader }) => {
  const isNewService = location.pathname === '/services/new';
  const isEditService = location.pathname.startsWith('/services/edit/');

  useEffect(() => {
    changeHeader({ noSearch: true });
  });
  return (
    <PageContent padding="24px">
      <Container text>
        {isNewService && (
          <React.Fragment>
            <h2>
              <Trans>Add a new service</Trans>
            </h2>
            <NewServiceFormContainer />
          </React.Fragment>
        )}
        {isEditService && <EditServiceContainer />}
      </Container>
    </PageContent>
  );
};

NewServiceScene.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(NewServiceScene),
);
