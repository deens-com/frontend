import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { media } from 'libs/styled';

import headerImg from './images/header.jpg';
import friendsImg from './images/friends.jpg';
import shareImg from './images/share.jpg';
import hostImg from './images/host.jpg';

import CallToAction from './CallToAction';
import ReferAFriend from './ReferAFriend';

import TopBar from '../../shared_components/TopBar';
import { Page, PageWrapper, PageContent } from '../../shared_components/layout/Page';
import BrandFooter from '../../shared_components/BrandFooter';
import { Helmet } from 'react-helmet';
import { websiteUrl } from 'libs/config';

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

const InfoBlock = styled.div`
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 48px 30px;
  margin: 20px 10px 0;
  text-align: center;
  ${media.minMedium} {
    display: flex;
  }
`;

const InfoTitle = styled.h3`
  margin-top: 47px;
  font-weight: bold;
  color: #3c434b;
  font-size: 24px;
  line-height: 28px;
  ${media.minMedium} {
    font-size: 36px;
    line-height: 46px;
  }
`;

const InfoContent = styled.div`
  ${media.minMedium} {
    text-align: left;
    margin: 0 45px;
    flex: 1;
  }
  ${media.minLargePlus} {
    margin: 0 80px;
  }
`;

const InfoDesc = styled.p`
  margin-top: 25px;
  color: #818181;
  font-size: 16px;
  line-height: 24px;
  ${media.minLargePlus} {
    margin-top: 35px;
  }
`;

const InfoImage = styled.span`
  display: none;
  background-image: url(${props => props.img});
  background-size: cover;
  background-position: center;
  max-width: 450px;
  height: 472px;
  flex: 1;
  ${media.minMedium} {
    display: inline-block;
  }
`;

const EarnMoney = ({ loggedIn, userProfile }) => {
  return (
    <Page>
      <Helmet>
        <title>Earn money by creating trips | Please.com</title>
        <link rel="canonical" href={`${websiteUrl}/earn-money`} />
        <meta name="description" content="Create end-to-end trips, share them and earn money." />
        <meta property="og:url" content={`${websiteUrl}/earn-money`} />
        <meta property="og:title" content="Earn money by creating trips!" />
        <meta
          property="og:description"
          content="Create end-to-end trips, share them and earn money."
        />
      </Helmet>
      <PageWrapper>
        <PageTop>
          <Header />
          <TopBar transparent />
          <HeaderText>
            <Title>Earn Money</Title>
            <Subtitle>
              Make money through your network, refer a friend, share a trip or add a service
            </Subtitle>
          </HeaderText>
        </PageTop>
        <PageContent>
          <InfoBlock>
            <InfoImage img={friendsImg} />
            <InfoContent>
              <InfoTitle>Get up to $29 for every friend you invite.</InfoTitle>
              <InfoDesc>
                We're serious about keeping you connected with friends and family. Invite your
                friends to Please via email, or share your referral code on Facebook or Twitter.
                <br />
                When you send a friend $33 in Please credit, you’ll get $17 when they travel. Your
                available travel credit automatically appears on the checkout page in the form of a
                coupon.
              </InfoDesc>
              <CallToAction
                loggedIn={loggedIn}
                text="Refer a friend"
                url="/"
                loggedOutText="Log In to Invite Friends"
                loggedInElement={<ReferAFriend userProfile={userProfile} />}
              />
            </InfoContent>
          </InfoBlock>
          <InfoBlock>
            <InfoContent>
              <InfoTitle>Earn Money by Sharing any Trip</InfoTitle>
              <InfoDesc>
                Earn $0.01 every time your sharing link is clicked. Up to $1 per day.
                <br />
                Earn $1 every time any one register via your sharing link, up to $9 per day.
                <br />
                Share Now.
              </InfoDesc>
              <CallToAction
                loggedIn={loggedIn}
                text="Share a trip"
                url="/results?serviceTypes=trip"
                loggedOutText="Log In to Share Trip"
              />
            </InfoContent>
            <InfoImage img={shareImg} />
          </InfoBlock>
          <InfoBlock>
            <InfoImage img={hostImg} />
            <InfoContent>
              <InfoTitle>Become a Please host, by adding services</InfoTitle>
              <InfoDesc>
                Share your home or add your tour on Please to build up your savings, fund your next
                trip, or simply meet interesting travelers.
              </InfoDesc>
              <CallToAction
                loggedIn={loggedIn}
                text="Add a service"
                url="/services/new"
                loggedOutText="Log In to Add Services"
              />
            </InfoContent>
          </InfoBlock>
        </PageContent>
        <BrandFooter />
      </PageWrapper>
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    loggedIn: Boolean(state.session.session.username),
    userProfile: state.session.session,
  };
};

export default connect(mapStateToProps)(EarnMoney);
