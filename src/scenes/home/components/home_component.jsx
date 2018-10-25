// NPM
import React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import TopBar from './../../../shared_components/TopBar';
import HomeSearch from './../../../styled_scenes/Home/components/HomeSearch';
import BrandFooter from './../../../shared_components/BrandFooter';
import MobileHero from './../../../styled_scenes/Home/components/MobileHero';
import HeroSlider from './../../../styled_scenes/Home/components/HeroSlider';
import SectionTrips from './../../../styled_scenes/Home/components/SectionTrips';
import SectionCTA from './../../../styled_scenes/Home/components/SectionCTA';
import SectionTopDestinations from './../../../styled_scenes/Home/components/SectionTopDestinations';
// ACTIONS/CONFIG
import { sizes, media } from './../../../libs/styled';

// STYLES
import { Page, PageWrapper, PageContent } from './../../../shared_components/layout/Page';

const PageTop = styled.div`
  width: 100%;
  position: relative;
`;

const HomeTagLine = styled.h1`
  color: #fff;
  font-size: 40px;
  letter-spacing: 0px;
  margin-top: 0px;
  margin-left: 13px;
  padding-top: 138px;
  padding-bottom: 47px;
  position: relative;
  font-weight: bold;
  text-align: center;
  line-height: 56px;
  max-width: 504px;
  margin: auto;

  ${media.minSmall} {
    font-size: 44px;
  }

  ${media.minMedium} {
    font-size: 48px;
  }

  span {
    font-size: 36px;
    left: 26px;
    letter-spacing: 0;
    position: absolute;
    top: -44px;
    font-family: 'Muli', sans-serif !important;
    font-weight: 200;

    ${media.minSmall} {
      font-size: 40px;
      left: 42px;
    }

    ${media.minMedium} {
      font-size: 60px;
      left: 68px;
    }

    @media screen and (max-width: 768px) {
      position: static;
    }
  }
`;

const HomeComponent = props => {
  return (
    <Page>
      <PageWrapper>
        <PageTop>
          <TopBar home noSearch={true} />
          <Media query={`(min-width: ${sizes.large})`}>
            {matches => (matches ? <HeroSlider /> : <MobileHero />)}
          </Media>
          <HomeTagLine>Book complete trips in minutes</HomeTagLine>
          <HomeSearch />
        </PageTop>
        <PageContent
          itemProp="itemList"
          itemScope
          itemType="http://schema.org/ItemList"
          padding="28px 0 0"
        >
          <SectionCTA loggedIn={Boolean(props.session.username)} />
          <SectionTrips trips={props.trips} isLoading={props.isLoadingTrips} />
          <SectionTopDestinations />
        </PageContent>
        <BrandFooter />
      </PageWrapper>
    </Page>
  );
};

export default HomeComponent;
