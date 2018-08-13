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
import SectionActivities from './../../../styled_scenes/Home/components/SectionActivities';
import SectionFood from './../../../styled_scenes/Home/components/SectionFood';
import SectionMood from './../../../styled_scenes/Home/components/SectionMood';
import SectionPlaces from './../../../styled_scenes/Home/components/SectionPlaces';
import SectionTrips from './../../../styled_scenes/Home/components/SectionTrips';

// ACTIONS/CONFIG
import { sizes, media } from './../../../libs/styled';

// STYLES
import { Page, PageWrapper, PageContent } from './../../../shared_components/layout/Page';

const Hero = styled.div`
  position: relative;

  & > div:first-child {
    position: relative;
    z-index: 2;
  }
`;

const HomeTagLine = styled.h1`
  color: #fff;
  font-size: 40px;
  letter-spacing: 0px;
  margin-bottom: 0px;
  margin-left: 13px;
  margin-top: 180px;
  position: relative;

  ${media.minSmall} {
    font-size: 60px;
  }

  ${media.minMedium} {
    font-size: 113px;
    letter-spacing: -4px;
  }

  span {
    font-size: 36px;
    left: 26px;
    letter-spacing: 0;
    position: absolute;
    top: -44px;

    ${media.minSmall} {
      font-size: 40px;
      left: 42px;
    }

    ${media.minMedium} {
      font-size: 60px;
      left: 68px;
    }
  }
`;

const HomeComponent = props => {
  return (
    <Page>
      <Hero>
        <PageWrapper>
          <TopBar home noSearch />
          <HomeTagLine>
            <span style={{ top: '-75px' }}>Rewarding</span> Experiences
          </HomeTagLine>
          <HomeSearch />
        </PageWrapper>
        <Media query={`(min-width: ${sizes.large})`}>
          {matches => (matches ? <HeroSlider /> : <MobileHero />)}
        </Media>
      </Hero>

      <PageContent
        itemProp="itemList"
        itemScope
        itemType="http://schema.org/ItemList"
        padding="100px 0 0"
      >
        {/*<SectionHappy categories={categories} />*/}
        <SectionMood tags={props.tags} />
        <SectionTrips trips={props.trips} />
        <SectionPlaces trips={props.popularPlaces} />
        <SectionActivities locations={props.exciting_activities} />
        <SectionFood foods={props.delicious_foods} />
        <PageWrapper>
          <BrandFooter />
        </PageWrapper>
      </PageContent>
    </Page>
  );
};

export default HomeComponent;
