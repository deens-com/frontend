import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserScene from './../../../styled_scenes/Users';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBar';

const UserComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent>
          <div style={{ maxWidth: '450px' }}>
            <UserScene {...props} />
          </div>
        </PageContent>
      </Page>
    </section>
  );
};

UserComponent.propTypes = {
  user: PropTypes.object,
};

export default UserComponent;
