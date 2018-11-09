import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import history from 'main/history';

import * as actions from './actions';
import Information from './Information';
import KYC from './KYC';

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
    max-width: 450px;
  }
`;

class TokenSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingToken: false,
    };
  }

  componentDidMount() {
    if (this.props.kycState === 1) {
      this.getToken();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.kycState === undefined && this.props.kycState === 1) {
      this.getToken();
    }
  }

  getToken = () => {
    this.props.fetchIFrameToken();
  };

  renderContent() {
    if (this.props.loggedIn === null) {
      return <Loader active size="big" />;
    }

    if (this.props.loggedIn === false) {
      history.push('/login', {
        message: 'Please login or register to continue with your trip.',
        from: '/token-sale',
      });
    }

    if (this.props.kycState === 1 || this.props.kyc_token || this.props.isLoadingToken) {
      return <KYC isLoading={this.props.isLoadingToken} kycToken={this.props.kyc_token} />;
    }

    return <Information goToNextStep={this.getToken} />;
  }

  render() {
    return (
      <Page>
        <PageWrapper>
          <PageTop>
            <Header />
            <TopBar home noSearch />
            <HeaderText>
              <Title>Welcome to Please.com Token Sale!</Title>
              <Subtitle>
                Please.com is a protocol and a marketplace to promote decentralization and
                progressively bring it to the masses through the travel industry.
              </Subtitle>
            </HeaderText>
          </PageTop>
          <PageContent>{this.renderContent()}</PageContent>
          <BrandFooter />
        </PageWrapper>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    kyc_token: state.TokenSaleReducer.kyc_token,
    loggedIn: state.SessionsReducer.session.loggedIn,
    isLoadingUser: state.SessionsReducer.session.isLoading,
    kycState: state.SessionsReducer.session.kycValidated,
    isLoadingToken: state.SessionsReducer.session.loading,
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
