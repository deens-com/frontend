// NPM
import React from "react";
import PropTypes from "prop-types";
import Media from "react-media";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";

// COMPONENTS
import TopBar from "../../components/TopBar";
import BrandFooter from "../../components/BrandFooter";
import CarouselPicker from "./components/CarouselPicker";
import Results from "./components/Results";
import MapMaker from "../../components/MapMarker";

// ACTIONS/CONFIG
import { media, sizes } from "../../libs/styled";
import { foodList } from "../../data/food";

// STYLES
import { Page, PageContent } from "../../components/layout/Page";

const MapWrapper = styled.div`
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
      <PageContent flex>
        <FoodWrapper>
          <CarouselPicker />
          <Results data={foodList} />
        </FoodWrapper>
        <Media
          query={`(min-width: ${sizes.large})`}
          render={() => (
            <MapWrapper>
              <GoogleMapReact
                defaultCenter={{ lat: 59.95, lng: 30.33 }}
                defaultZoom={11}
              >
                <MapMaker lat={59.95} lng={30.33} scale={1} color="#4fb798" />
                <MapMaker lat={59.96} lng={30.34} scale={1} color="#4fb798" />
                <MapMaker lat={59.96} lng={30.3} scale={1} color="#4fb798" />
                <MapMaker lat={59.97} lng={30.31} scale={1} color="#4fb798" />
              </GoogleMapReact>
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
