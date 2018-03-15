// NPM
import React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import styled from 'styled-components';

// COMPONENTS
import TopBar from '../../components/TopBar';
import BrandFooter from '../../components/BrandFooter';
import CarouselPicker from './components/CarouselPicker';
import Results from './components/Results';

// ACTIONS/CONFIG
import { media, sizes } from '../../libs/styled';
import { foodList } from '../../data/food';

// STYLES
import { Page, PageContent } from '../../components/layout/Page';

const MapWrapper = styled.div`
  height: 100vh;
  width: 42%;
  background: #5cb89e;
  display: flex;
  align-items: center;
  justify-content: center;

  h3 {
    color: #fff;
    font-size: 52px;
    text-align: center;
    max-width: 400px;
  }

  // ${media.minMedium} {
  // }
`;

const FoodWrapper = styled.div`
  width: 100%;

  ${media.minLarge} {
    width: 58%;
  }
`;

// MODULE
export default function FoodScene({}) {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent>
        <FoodWrapper>
          <CarouselPicker />
          <Results data={foodList} />
        </FoodWrapper>
        <Media
          query={`(min-width: ${sizes.large})`}
          render={() => (
            <MapWrapper>
              <h3>Map Wrapper</h3>
            </MapWrapper>
          )}
        />
      </PageContent>
      <BrandFooter withTopBorder withPadding />
    </Page>
  );
}

// Props Validation
FoodScene.propTypes = {};
