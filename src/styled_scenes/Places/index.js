// NPM
import React from "react";
import PropTypes from "prop-types";

// COMPONENTS
import TopBar from "../../shared_components/TopBar";
import BrandFooter from "../../shared_components/BrandFooter";

// ACTIONS/CONFIG

// STYLES
import { Page, PageContent } from "../../shared_components/layout/Page";

// MODULE
export default function PlacesScene({}) {
  return (
    <Page>
      <TopBar fixed withPadding />
      <PageContent>Content</PageContent>
      <BrandFooter withTopBorder withPadding />
    </Page>
  );
}

// Props Validation
PlacesScene.propTypes = {};
