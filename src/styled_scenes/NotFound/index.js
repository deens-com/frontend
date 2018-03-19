// NPM
import React from "react";
import PropTypes from "prop-types";

// COMPONENTS
import TopBar, { BarRight } from "../../components/TopBar";
import Logo from "../../components/TopBar/Logo";
import BrandFooter from "../../components/BrandFooter";
import FooterNav from "../Home/components/FooterNav";

// ACTIONS/CONFIG

// STYLES
import { Hr } from "../../components/styledComponents/misc";
import { Page, PageWrapper, PageContent } from "../../components/layout/Page";

// MODULE
export default function NotFoundScene({}) {
  return (
    <Page>
      <PageWrapper>
        <TopBar>
          <Logo />
          <BarRight>Links</BarRight>
        </TopBar>
      </PageWrapper>
      <PageContent>
        <PageWrapper>
          <h1
            style={{
              textAlign: "center",
              marginTop: "100px",
              marginBottom: "15px"
            }}
          >
            404. Not found!
          </h1>
          <p style={{ textAlign: "center", marginBottom: "150px" }}>
            We are sorry but we could not find the page you are looking for.
          </p>
          <Hr withSpacing />
          <FooterNav />
          <Hr />
          <BrandFooter />
        </PageWrapper>
      </PageContent>
    </Page>
  );
}

// Props Validation
NotFoundScene.propTypes = {};
