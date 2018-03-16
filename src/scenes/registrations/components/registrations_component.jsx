import React, { Component } from 'react';
import RegistrationFormComponent from './registration_form_component';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from './../../../shared_components/TopBar';
import BrandFooter from './../../../shared_components/BrandFooter';

const RegistrationsComponent = props => {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent>
        <RegistrationFormComponent {...props} />
      </PageContent>
    </Page>
  );
};

export default RegistrationsComponent;
