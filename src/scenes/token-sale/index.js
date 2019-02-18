import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import history from 'main/history';
import axios from 'libs/axios';

import Information from './Information';
import KYC from './KYC';
import BuyTokens from './BuyTokens';
import SmartContract from './BuyTokens/SmartContract';

import { media } from 'libs/styled';

import headerImg from './images/header.jpg';

import TermsAgreement from './TermsAgreement';
import ThankYou from './ThankYou';
import TokenBought from './TokenBought';
import TopBar from '../../shared_components/TopBar';
import { Page, PageWrapper, PageContent } from '../../shared_components/layout/Page';
import BrandFooter from '../../shared_components/BrandFooter';
import fetchHelperFactory, { defaultState } from 'libs/fetchHelper';
import api from 'libs/apiClient';
import { icoReady } from 'libs/config';

const PageTop = styled.div`
  width: 100%;
  position: relative;
  height: 350px;
`;

const Header = styled.div`
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${headerImg});
  background-size: cover;
  background-position: center;
  width: 100vw;
  position: absolute;
  left: calc(-50vw - -50%);
  height: 350px;
`;

const HeaderText = styled.div`
  color: white;
  position: relative;
  padding-top: 120px;
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
    max-width: 450px;
  }
`;

class TokenSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agreedTerms: false,
      iframeToken: {
        ...defaultState,
        isLoading: false,
      },
    };
    this.fetchToken = fetchHelperFactory(
      this.setState.bind(this),
      'iframeToken',
      api.users.kycToken.get,
    );
  }
  componentDidMount() {
    if (this.props.kycState === 0 && this.props.oldKycToken) {
      this.getToken();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.kycState === 0 && (!prevProps.oldKycToken && this.props.oldKycToken)) {
      this.getToken();
    }
  }

  getToken = () => {
    if (this.props.loggedIn === false) {
      history.push('/register', {
        message: 'Please login or register to continue with the verification process.',
        from: '/token-sale',
      });
      return;
    }
    this.fetchToken();
  };

  getTitle() {
    if (this.props.kycState === 0) {
      return 'Welcome to Please.com Token Sale!';
    }

    if (this.props.kycState === 1 && !this.state.agreedTerms) {
      return 'Just one more step before you can contribute';
    }

    return 'Purchase PLS Tokens';
  }

  onTokenBought = async () => {
    this.setState({
      tokensBought: true,
    });
  };

  onTermsAgree = async () => {
    this.setState({
      agreedTerms: true,
    });
    axios.patch('/users/me', { kycValidated: 2 });
  };

  renderContent() {
    if (this.props.isLoadingToken || this.state.iframeToken.isLoading) {
      return <Loader inline="centered" active size="big" />;
    }

    if (this.state.tokenBought) {
      return <TokenBought />;
    }

    if (this.props.kycState === 2 || this.state.agreedTerms) {
      if (this.props.location.pathname === '/token-sale/smart-contract') {
        return (
          <SmartContract
            whitelistedAddress={
              this.props.whitelistedAddresses && this.props.whitelistedAddresses[0]
            }
          />
        );
      }
      return <BuyTokens onTokenBought={this.onTokenBought} plsBalance={this.props.plsBalance} />;
    }

    if (this.props.kycState === 1) {
      if (icoReady) {
        return <TermsAgreement onProceed={this.onTermsAgree} />;
      }
      return <ThankYou />;
    }

    if (this.state.iframeToken.data) {
      return (
        <KYC
          kycToken={this.state.iframeToken.data.token}
          locationPathname={this.props.location.pathname}
        />
      );
    }

    return <Information goToNextStep={this.getToken} />;
  }

  renderHeader() {
    if (this.props.loggedIn === null) {
      return <TopBar />;
    }

    const title = this.getTitle();
    const subtitle =
      this.props.kycState === 0
        ? 'Please.com is a protocol and a marketplace to promote decentralization and progressively bring it to the masses through the travel industry.'
        : '';

    return (
      <PageTop>
        <Header />
        <TopBar transparent noSearch />
        <HeaderText>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </HeaderText>
      </PageTop>
    );
  }

  render() {
    return (
      <Page>
        <PageWrapper>
          {this.renderHeader()}
          {this.props.loggedIn === null ? (
            <Loader inline="centered" active size="big" />
          ) : (
            <PageContent>{this.renderContent()}</PageContent>
          )}
          <BrandFooter />
        </PageWrapper>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.session.loggedIn,
    isLoadingUser: state.session.isLoading,
    kycState: state.session.session.kycValidated || 0,
    plsBalance: state.session.session.plsBalance,
    oldKycToken: state.session.session.kycToken,
    whitelistedAddresses: state.session.session.whitelistedIcoAddresses,
  };
};

export default withRouter(connect(mapStateToProps)(TokenSale));
