// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Media from "react-media";

// COMPONENTS
import TopBar from "./../../../shared_components/TopBar";
import SubHero from "./../../../styled_scenes/Home/components/SubHero";
import HomeSearch from "./../../../styled_scenes/Home/components/HomeSearch";
import BrandFooter from "./../../../shared_components/BrandFooter";
import FooterNav from "./../../../styled_scenes/Home/components/FooterNav";
import MobileHero from "./../../../styled_scenes/Home/components/MobileHero";
import Button from "./../../../shared_components/Button";
import HeroSlider from "./../../../styled_scenes/Home/components/HeroSlider";
import SectionActivities from "./../../../styled_scenes/Home/components/SectionActivities";
import SectionFood from "./../../../styled_scenes/Home/components/SectionFood";
import SectionHappy from "./../../../styled_scenes/Home/components/SectionHappy";
import SectionMood from "./../../../styled_scenes/Home/components/SectionMood";
import SectionPlaces from "./../../../styled_scenes/Home/components/SectionPlaces";
import SectionTrips from "./../../../styled_scenes/Home/components/SectionTrips";

// ACTIONS/CONFIG
import {
  categories,
  tags,
  tripsData,
  placesData,
  activitiesData,
  foodData
} from "./../../../data/home";
import { sizes, media } from "./../../../libs/styled";

// STYLES
import { Hr } from "./../../../shared_components/styledComponents/misc";
import {
  Page,
  PageWrapper,
  PageContent
} from "./../../../shared_components/layout/Page";

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
    font-family: "HaydonBrush", Georgia, serif;
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
            <span>Rewarding</span> Experiences
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
        <SectionHappy categories={categories} />
        <SectionMood tags={tags} />
        <SectionTrips trips={tripsData} />
        <SectionPlaces trips={placesData} />
        <SectionActivities locations={activitiesData} />
        <SubHero />
        <SectionFood foods={foodData} />
        <PageWrapper>
          <Hr withSpacing />
          <FooterNav />
          <Hr />
          <BrandFooter />
        </PageWrapper>
      </PageContent>
    </Page>
  );
};

export default HomeComponent;
