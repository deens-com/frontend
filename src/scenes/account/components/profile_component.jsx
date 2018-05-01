import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfileScene from './../../../styled_scenes/Account/Profile';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBar';

const ProfileComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent padding="24px">
          <ProfileScene {...props} />
        </PageContent>
      </Page>
    </section>
  );
};

ProfileComponent.propTypes = {
  user: PropTypes.object,
};

export default ProfileComponent;
