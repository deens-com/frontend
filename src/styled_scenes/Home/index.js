// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Media from "react-media";

// COMPONENTS
import BrandFooter from "../../components/BrandFooter";
import Button from "../../components/Button";
import hands from "./components/HeroSlider/img/hands.jpg";
import HeroSlider from "./components/HeroSlider";
import HomeSearch from "./components/HomeSearch";
import MobileHero from "./components/MobileHero";
import SectionActivities from "./components/SectionActivities";
import SectionFood from "./components/SectionFood";
import SectionHappy from "./components/SectionHappy";
import SectionMood from "./components/SectionMood";
import SectionPlaces from "./components/SectionPlaces";
import SectionTrips from "./components/SectionTrips";
import TopBar from "../../components/TopBar";

// ACTIONS/CONFIG
import {
  categories,
  tags,
  tripsData,
  placesData,
  activitiesData,
  foodData
} from "../../data/home";
import { sizes, media } from "../../libs/styled";

// STYLES
import { Hr } from "../../components/styledComponents/misc";
import { Page, PageWrapper, PageContent } from "../../components/layout/Page";

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

// MODULE
export default class HomeScene extends Component {
  render() {
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
          <SectionFood foods={foodData} />
          <PageWrapper>
            <Hr withSpacing />
            <Hr />
            <BrandFooter />
          </PageWrapper>
        </PageContent>
      </Page>
    );
  }
}

// Props Validation
HomeScene.propTypes = {};
