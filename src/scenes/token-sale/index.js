import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import * as actions from './actions';

import { media } from 'libs/styled';

import headerImg from './images/header.jpg';

import TopBar from '../../shared_components/TopBar';
import { Page, PageWrapper, PageContent } from '../../shared_components/layout/Page';
import BrandFooter from '../../shared_components/BrandFooter';

const PageTop = styled.div`
  width: 100%;
  position: relative;
  height: 426px;
`;

const Header = styled.div`
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${headerImg});
  background-size: cover;
  background-position: center;
  width: 100vw;
  position: absolute;
  left: calc(-50vw - -50%);
  height: 426px;
`;

const HeaderText = styled.div`
  color: white;
  position: relative;
  padding-top: 170px;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 36px;
  line-height: 42px;
  margin: 0 0 36px;
  padding: 0;
  filter: drop-shadow(0 4px 18px rgba(0, 0, 0, 0.11));
  ${media.minMedium} {
    font-size: 48px;
    line-height: 56px;
  }
`;

const Subtitle = styled.h2`
  font-size: 14px;
  line-height: 18px;
  margin: auto;
  padding: 0;
  max-width: 296px;
  ${media.minMedium} {
    font-size: 18px;
    line-height: 22px;
    max-width: 350px;
  }
`;

class TokenSale extends Component {
  loadIFrame(accessToken) {
    window.idensic.init('#idensic', {
      accessToken,
      requiredDocuments:
        'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE;PROOF_OF_RESIDENCE:UTILITY_BILL,BANK_STATEMENT,OTHER',
    });
  }

  componentDidMount() {
    this.props.fetchIFrameToken();
  }

  render() {
    const kycToken = this.props.kyc_token;
    if (kycToken) {
      this.loadIFrame(kycToken);
    }
    return (
      <Page>
        <PageWrapper>
          <PageTop>
            <Header />
            <TopBar home />
            <HeaderText>
              <Title>Token Sale</Title>
              <Subtitle>Welcome to Please.com token sale!</Subtitle>
            </HeaderText>
          </PageTop>
          <PageContent>
            <div id="idensic" />
          </PageContent>
          <BrandFooter />
        </PageWrapper>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    kyc_token: state.TokenSaleReducer.kyc_token,
    loggedIn: Boolean(state.SessionsReducer.session.username),
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TokenSale),
);
