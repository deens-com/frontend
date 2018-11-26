// NPM
import React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import TopBar from 'shared_components/TopBar';
import Button from 'shared_components/Button';
import HomeSearch from './../../../styled_scenes/Home/components/HomeSearch';
import BrandFooter from './../../../shared_components/BrandFooter';
import MobileHero from './../../../styled_scenes/Home/components/MobileHero';
import HeroSlider from './../../../styled_scenes/Home/components/HeroSlider';
import SectionTrips from './../../../styled_scenes/Home/components/SectionTrips';
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
  position: relative;
  font-weight: bold;
  text-align: center;
  line-height: 56px;
  max-width: 630px;
  margin: auto;

  ${media.minSmall} {
    font-size: 44px;
  }

  ${media.minMedium} {
    font-size: 48px;
  }
`;

const HomeSecondTagLine = styled.h2`
  position: relative;
  font-size: 18px;
  text-transform: uppercase;
  padding-bottom: 30px;
  color: white;
  margin: auto;
  text-align: center;
  margin-top: 5px;
`;

const CreateTrip = styled.div`
  text-align: center;
  position: relative;
  padding-bottom: 150px;
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
          <HomeTagLine>Book complete customizable trips in minutes</HomeTagLine>
          <HomeSecondTagLine>No added costs</HomeSecondTagLine>
          <HomeSearch />
          <CreateTrip>
            <Button
              padding="16px 28px"
              fontSize="16px"
              theme="fillLightGreen"
              href="/trips/create"
              type="link"
            >
              or <strong>Create a trip from scratch</strong>
            </Button>
          </CreateTrip>
        </PageTop>
        <PageContent
          itemProp="itemList"
          itemScope
          itemType="http://schema.org/ItemList"
          padding="28px 0 0"
        >
          <SectionTrips trips={props.trips} isLoading={props.isLoadingTrips} />
          <SectionTopDestinations />
        </PageContent>
        <BrandFooter />
      </PageWrapper>
    </Page>
  );
};

export default HomeComponent;
