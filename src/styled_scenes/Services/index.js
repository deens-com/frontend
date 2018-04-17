// NPM
import React from "react";
import PropTypes from "prop-types";
import Media from "react-media";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";

// COMPONENTS
import TopBar from "./components/TopBar";
import BrandFooter from "./../../shared_components/BrandFooter";
import CarouselPicker from "./components/CarouselPicker";
import SearchFilters from "./components/SearchFilters";
import Results from "./components/Results";
import MapMaker from "./../../shared_components/MapMarker";

// ACTIONS/CONFIG
import { media, sizes } from "../../libs/styled";
// import { foodList } from "../../data/food";

// STYLES
import { Page, PageContent } from "./../../shared_components/layout/Page";

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

const ServicesWrapper = styled.div`
  width: 100%;

  ${media.minLarge} {
    width: 58%;
  }
`;

// MODULE
export default function ServicesScene(props) {
  const geo = !props.service_data.length
    ? {lat: 48.856614, lon: 2.3522219000000177}
    : {lat: props.service_data[0].latitude, lon: props.service_data[0].longitude}
  return (
    <Page topPush>
      <TopBar {...props} fixed withPadding />
      <PageContent flex>
        <ServicesWrapper>
          <SearchFilters {...props} />
          <CarouselPicker {...props} />
          <Results {...props} data={props.service_data} />
        </ServicesWrapper>
        <Media
          query={`(min-width: ${sizes.large})`}
          render={() => (
            <MapWrapper>
              <GoogleMapReact
                defaultCenter={{ lat: geo.lat, lng: geo.lon }}
                defaultZoom={12}
                bootstrapURLKeys={{
                  key: "AIzaSyDICUW2RF412bnmELi3Y_zCCzHa-w8WnXc"
                }}
              >
                {
                  props.service_data.map(service =>
                    <MapMaker key={service.objectId} lat={parseFloat(service.latitude)} lng={parseFloat(service.longitude)} scale={1} color="#4fb798" />
                  )
                }
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
ServicesScene.propTypes = {};
