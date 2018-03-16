// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
//import Link from 'gatsby-link';
import Media from 'react-media';

// COMPONENTS
import TopBar from './../../../shared_components/TopBar';
import Section from './../../../shared_components/Section';
import HomeSearch from './../../../styled_scenes/Home/components/HomeSearch';
import BrandFooter from './../../../shared_components/BrandFooter';
import FooterNav from './../../../shared_components/FooterNav';
import DesktopHeroSlider from './../../../styled_scenes/Home/components/DesktopHeroSlider';
import MobileHero from './../../../styled_scenes/Home/components/MobileHero';
import Button from './../../../shared_components/Button';
import hands from './../../../styled_scenes/Home/img/hands.jpg';
import SliderPerson from './../../../styled_scenes/Home/components/SliderPerson';

// ACTIONS/CONFIG
import { categories, tags, tripsData, placesData, activitiesData, foodData } from './../../../data/home';
import { sizes } from './../../../libs/styled';
import theme from './../../../config/theme';

// STYLES
import { Page, PageWrapper, PageContent } from './../../../shared_components/layout/Page';
import { Hr } from './../../../shared_components/styledComponents/misc';

const Hero = styled.div`
  position: relative;
  & > div:first-child {
    position: relative;
    z-index: 2;
  }
`;

const HomeTagLine = styled.h1`
  color: #fff;
  font-size: 113px;
  margin-top: 180px;
  margin-left: 13px;
  position: relative;
  margin-bottom: 0px;
  letter-spacing: -4px;

  span {
    font-family: 'HaydonBrush', Georgia, serif;
    font-size: 60px;
    position: absolute;
    top: -44px;
    left: 68px;
    letter-spacing: 0;
  }
`;

const SubHero = styled.div`
  position: relative;
  padding-top: 15px;
  padding-bottom: 100px;
  margin-bottom: 50px;
  color: white;
`;

const SubTag = styled.span`
  font-family: 'HaydonBrush', Georgia, serif;
  font-size: 44px;
  display: inline-block;
  margin-bottom: 15px;
`;

const SubTitle = styled.p`
  font-size: 48px;
  max-width: 520px;
  margin-bottom: 25px;
  line-height: 1.2;
  letter-spacing: -2px;
`;

const SubBG = styled.div`
  position: absolute;
  top: -110px;
  bottom: 0;
  left: 0;
  right: 0;
  background: #eee;
  background: url(${hands});
  background-size: 120%;
  background-position: 0% 40%;
  z-index: -1;
`;


const HomeComponent = (props) => {
  return(
    <section>
      <Page>
        <Hero>
          <PageWrapper>
            <TopBar transparent noSearch />
            <HomeTagLine>
              <span>Rewarding</span> Experiences
            </HomeTagLine>
            <HomeSearch />
          </PageWrapper>
          <Media query={`(min-width: ${sizes.large})`}>
            {matches => (matches ? <DesktopHeroSlider /> : <MobileHero />)}
          </Media>
        </Hero>

        <PageContent flex>
          <Section title="What makes you happy?" type="category" data={categories} />
          <Section title="What is your mood?" type="tag" data={tags} />
          <Section
            title="Amazing Trips"
            type="trip"
            headerLink={{
              href: '/trips',
              text: 'All trips'
            }}
            data={tripsData}
          />
          <Section
            title="Popular places"
            type="trip"
            headerLink={{
              href: '/places',
              text: 'All places'
            }}
            data={placesData}
          />
          <Section
            title="Exciting activities"
            type="location"
            headerLink={{
              href: '/activities',
              text: 'All experiences'
            }}
            data={activitiesData}
          />
          <SubHero>
            <PageWrapper>
              <SubTag>Share your passion</SubTag>
              <SubTitle>
                Earn up to 500€ <br />by sharing experience with others
              </SubTitle>
              <Button type="link" href="/" round size="medium" theme={theme.button.mainFilled}>
                Become a host
              </Button>
            </PageWrapper>
            <SliderPerson name="Handmade clay dishes" location="Bali, Indonesia" avatar="#" />
            <SubBG />
          </SubHero>
          <Section
            title="Delicious food"
            type="trip"
            headerLink={{
              href: '/food',
              text: 'All foods'
            }}
            data={foodData}
          />
          <PageWrapper>
            <Hr withSpacing />
            <FooterNav />
            <Hr />
            <BrandFooter />
          </PageWrapper>
        </PageContent>
      </Page>
    </section>
  )
}

export default HomeComponent
