// NPM
import React, { Component } from 'react';
import Media from 'react-media';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';

// COMPONENTS
import TopBar from './../../shared_components/TopBarWithSearch';

import BrandFooter from './../../shared_components/BrandFooter';
import SearchFilters from './components/SearchFilters';
import Results from './components/Results';
import MapMaker from './../../shared_components/MapMarker';

// ACTIONS/CONFIG
import { media, sizes } from '../../libs/styled';
// import { foodList } from "../../data/food";

// STYLES
import { Page, PageContent } from './../../shared_components/layout/Page';

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

const defaultCenter = {
  lat: 48.856614,
  lng: 2.3522219000000177,
};
const defaultZoom = 11;

export default class ResultsScene extends Component {
  state = {
    center: defaultCenter,
    zoom: defaultZoom,
    markers: [],
  };

  static propTypes = {};

  getMarkerLatLngs = props => {
    return props.service_data.filter(({ latitude, longitude }) => latitude && longitude).map(service => ({
      key: service.objectId,
      lat: parseFloat(service.latitude),
      lng: parseFloat(service.longitude),
    }));
  };

  getCenterAndZoom = markers => {
    if (!markers.length) return { center: defaultCenter, zoom: defaultZoom };
    if (markers.length === 1) {
      return { center: markers[0], zoom: defaultZoom };
    }
    const bounds = new window.google.maps.LatLngBounds();
    for (const marker of markers) {
      bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
    }
    const newBounds = {
      ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
      sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
    };
    // TODO: @jaydp dynamically calculate this width and height
    const size = { width: 400, height: 800 };
    const { center, zoom } = fitBounds(newBounds, size);
    // if we zoom more than 14, it's too much zoomed into a really small location
    return { center, zoom: Math.min(zoom, 14) };
  };

  componentWillReceiveProps(nextProps) {
    const currentMarkers = this.getMarkerLatLngs(this.props);
    const newMarkers = this.getMarkerLatLngs(nextProps);
    if (currentMarkers.length !== newMarkers.length) {
      const { center, zoom } = this.getCenterAndZoom(newMarkers);
      console.log({ center, zoom });
      this.setState({ center, zoom, markers: newMarkers });
    }
  }

  render() {
    const { props } = this;
    const { center, zoom, markers } = this.state;
    return (
      <Page topPush>
        <TopBar {...props} fixed withPadding />
        <PageContent flex>
          <ServicesWrapper>
            <br />
            <SearchFilters {...props} />
            <Results {...props} data={props.service_data} />
          </ServicesWrapper>
          <Media
            query={`(min-width: ${sizes.large})`}
            render={() => (
              <MapWrapper>
                <GoogleMapReact
                  center={center}
                  zoom={zoom}
                  bootstrapURLKeys={{
                    key: 'AIzaSyDICUW2RF412bnmELi3Y_zCCzHa-w8WnXc',
                  }}
                >
                  {markers.map(marker => <MapMaker {...marker} scale={1} color="#4fb798" />)}
                </GoogleMapReact>
              </MapWrapper>
            )}
          />
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}
