// NPM
import React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import TopBar from 'shared_components/TopBar';
import HomeSearch from 'styled_scenes/Home/components/HomeSearch';
import BrandFooter from 'shared_components/BrandFooter';
import MobileHero from 'styled_scenes/Home/components/MobileHero';
import HeroSlider from 'styled_scenes/Home/components/HeroSlider';
import SectionTrips from 'styled_scenes/Home/components/SectionTrips';
import FeaturedTripCreator from 'styled_scenes/Home/components/FeaturedTripCreator';
import SectionTopDestinations from 'styled_scenes/Home/components/SectionTopDestinations';
import SectionBookTrip from 'styled_scenes/Home/components/SectionBookTrip';

// ACTIONS/CONFIG
import { sizes, media } from './../../../libs/styled';

// STYLES
import { PageContent, PageWrapper } from './../../../shared_components/layout/Page';

const PageTop = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 45px;
`;

const HomeTagLine = styled.h1`
  color: #fff;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: 0px;
  margin-top: 0px;
  margin-left: 13px;
  padding-top: 110px;
  padding-bottom: 20px;
  position: relative;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  max-width: 590px;
  margin: auto;

  ${media.minSmall} {
    font-size: 34px;
  }

  ${media.minMedium} {
    font-size: 34px;
  }
`;

const HomeComponent = props => {
  return (
    <>
      <PageTop>
        <Media query={`(min-width: ${sizes.large})`}>
          {matches => (matches ? <HeroSlider /> : <MobileHero />)}
        </Media>
        <HomeTagLine>Customizable Trips created by Locals at no cost!</HomeTagLine>
        <HomeSearch updateSearchParams={props.updateSearchParams} />
      </PageTop>
      <PageContent
        itemProp="itemList"
        itemScope
        itemType="http://schema.org/ItemList"
        padding="28px 0 0"
      >
        <SectionTrips
          retryFunction={props.retryFunction}
          trips={props.trips}
          isLoading={props.isLoading}
        />
        <SectionBookTrip />
        <SectionTopDestinations />
        <FeaturedTripCreator />
      </PageContent>
      <BrandFooter />
    </>
  );
};

export default HomeComponent;
