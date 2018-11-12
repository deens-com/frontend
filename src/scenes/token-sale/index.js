import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import history from 'main/history';
import axios from 'libs/axios';

import * as actions from './actions';
import Information from './Information';
import KYC from './KYC';
import BuyTokens from './BuyTokens';

import { media } from 'libs/styled';

import headerImg from './images/header.jpg';

import TermsAgreement from './TermsAgreement';
import TopBar from '../../shared_components/TopBar';
import { Page, PageWrapper, PageContent } from '../../shared_components/layout/Page';
import BrandFooter from '../../shared_components/BrandFooter';

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
    };
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
    this.props.fetchIFrameToken();
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

  onTermsAgree = async () => {
    this.setState({
      agreedTerms: true,
    });
    axios.patch('/users/me', { kycValidated: 2 });
  };

  renderContent() {
    if (this.props.kycState === 2 || this.state.agreedTerms) {
      return <BuyTokens />;
    }

    if (this.props.kycState === 1) {
      return <TermsAgreement onProceed={this.onTermsAgree} />;
    }

    if (this.props.isLoadingToken || this.state.isLoading) {
      return <Loader inline="centered" active size="big" />;
    }

    if (this.props.kyc_token) {
      return (
        <KYC kycToken={this.props.kyc_token} locationPathname={this.props.location.pathname} />
      );
    }

    return <Information goToNextStep={this.getToken} />;
  }

  renderHeader() {
    if (this.props.loggedIn === null) {
      return <TopBar fixed />;
    }

    const title = this.getTitle();
    const subtitle =
      this.props.kycState === 0
        ? 'Please.com is a protocol and a marketplace to promote decentralization and progressively bring it to the masses through the travel industry.'
        : '';

    return (
      <PageTop>
        <Header />
        <TopBar home noSearch />
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
    kyc_token: state.TokenSaleReducer.kyc_token,
    loggedIn: state.SessionsReducer.loggedIn,
    isLoadingUser: state.SessionsReducer.isLoading,
    kycState: state.SessionsReducer.session.kycValidated || 0,
    oldKycToken: state.SessionsReducer.session.kycToken,
    isLoadingToken: state.TokenSaleReducer.loading,
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
