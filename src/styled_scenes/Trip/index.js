// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';

// COMPONENTS
import TopBar from 'shared_components/TopBar';
import BrandFooter from 'shared_components/BrandFooter';

// STYLES
import { Page, PageContent } from 'shared_components/layout/Page';

import Header from './Header';
import FixedFooter from './FixedFooter';

const Wrapper = styled.div``;

export default class ResultsScene extends Component {
  renderPageContent = () => {
    const { isLoading, trip, owner } = this.props;

    if (isLoading || !trip) {
      return <Loader active inline="centered" size="massive" />;
    }

    return (
      <Wrapper>
        <Header trip={trip} owner={owner} />
      </Wrapper>
    );
  };

  render() {
    return (
      <Page>
        <TopBar fixed />
        <PageContent>{this.renderPageContent()}</PageContent>
        <BrandFooter withTopBorder withPadding />
        <FixedFooter />
      </Page>
    );
  }
}
