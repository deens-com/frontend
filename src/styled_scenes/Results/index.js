// NPM
import React, { Component } from 'react';
//import Media from 'react-media';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import { Checkbox } from 'semantic-ui-react';
import Media from 'react-media';

import history from 'main/history';
// COMPONENTS
import TopBar from './../../shared_components/TopBar';

import BrandFooter from './../../shared_components/BrandFooter';
import Filters from './components/Filters';
import Results from './components/Results';
import MapMaker from './../../shared_components/MapMarker';
import CreateServiceModal from './components/CreateServiceModal';

// ACTIONS/CONFIG
import { media } from '../../libs/styled';
import { waitUntilMapsLoaded } from 'libs/Utils';
// import { foodList } from "../../data/food";

// STYLES
import { Page, PageContent } from './../../shared_components/layout/Page';

const MapWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 70px - 1.8em - 60px);
  right: 0;
  margin-top: 1.8em;
  position: relative;
  width: 100%;
  h3 {
    color: #fff;
    font-size: 52px;
    text-align: center;
    max-width: 400px;
  }
`;

const MapPlaceholder = styled.div`
  display: none;
  width: 100%;
`;

const ServicesWrapper = styled.div`
  width: 100%;
  min-height: 90vh;

  ${media.minLarge} {
    // width: 58%;
  }
`;

const GoBackToTrip = styled.span`
  color: white;
  margin-top: 15px;
  margin-left: 20px;
  padding: 3px 7px;
  cursor: pointer;
  display: inline-block;
  background-color: #4ac4a1;
  border-radius: 20px;
`;

const AddingServiceTopBar = styled.div`
  display: flex;
  align-items: center;
`;

const CreateService = styled.div`
  color: #4ac4a1;
  margin-top: 15px;
  margin-left: 20px;
  cursor: pointer;
`;

const MapToggle = styled.div`
  display: flex;
  flex-flow: row-reverse;
  padding-right: 1em;
  //padding-bottom: 1em;
  margin-top: -2.5em;
`;

const defaultCenter = {
  lat: 48.856614,
  lng: 2.3522219000000177,
};
const defaultZoom = 11;

export default class ResultsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: defaultCenter,
      zoom: defaultZoom,
      markers: [],
      showMap: false,
    };
    this.mapRef = React.createRef();
    this.mapPlaceholderRef = React.createRef();
  }

  static propTypes = {};

  getMarkerLatLngs = props => {
    return props.service_data
      .filter(({ latitude, longitude }) => latitude && longitude)
      .map(service => ({
        key: service.objectId,
        lat: parseFloat(service.geo.lat),
        lng: parseFloat(service.geo.lng),
        name: service.name,
        id: service.objectId,
        hover: false,
      }));
  };

  getZoomByRadius = () => {
    const radius = Number(this.props.radiusInKm);

    if (radius >= 100) {
      return 9;
    }

    if (radius >= 50) {
      return 10;
    }

    if (radius >= 20) {
      return 11;
    }

    if (radius >= 10) {
      return 12;
    }

    return 13;
  };

  getCenterAndZoom = (markers, props) => {
    const zoomByRadius = this.getZoomByRadius();
    if (!markers.length) {
      if (props.latitude && props.longitude) {
        const center = { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) };
        return { center: center, zoom: zoomByRadius };
      } else {
        return { center: defaultCenter, zoom: zoomByRadius };
      }
    }
    if (markers.length === 1) {
      return { center: markers[0], zoom: zoomByRadius };
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
    const hasLocationsChanged =
      nextProps.service_data.map(item => item.name).join(',') ===
      this.props.service_data.map(item => item.name).join(',');

    if (hasLocationsChanged) {
      const newMarkers = this.getMarkerLatLngs(nextProps);
      const { center, zoom } = this.getCenterAndZoom(newMarkers, nextProps);
      this.setState({ center, zoom, markers: newMarkers });
    }
  }

  componentDidMount() {
    const { center, zoom } = this.getCenterAndZoom([], this.props);
    this.setState({ center, zoom, markers: [] });
  }

  componentWillUnmount() {
    if (this.state.showMap) {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('scroll', this.resizeHandler);
    }
  }

  toggleMap = () => {
    this.setState(prevState => {
      if (prevState.showMap) {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('scroll', this.resizeHandler);
      } else {
        this.unfixMap();
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.resizeHandler);
      }
      return { showMap: !prevState.showMap };
    });
  };

  resizeHandler = () => {
    if (this.mapPosition === 'fixed') {
      this.fixMap();
      return;
    }
    this.unfixMap(this.mapPosition === 'initial');
  };

  fixMap = () => {
    const style = this.mapRef.current.style;
    style.position = 'fixed';
    style.width = 'calc(50vw - 10px)';
    style.height = 'calc(100vh - 70px)';
    style.marginTop = '0';
    style.top = '70px';

    this.mapPlaceholderRef.current.style.display = 'flex';
    this.mapPosition = 'fixed';
  };

  unfixMap = (initial = true) => {
    const style = this.mapRef.current.style;
    style.position = 'relative';
    style.width = '100%';
    style.height = initial ? 'calc(100vh - 70px - 1.8em - 60px)' : `calc(100vh - 70px - 105px)`;
    style.marginTop = initial ? '1.8em' : '0';
    style.top = initial ? '0' : null;
    style.alignSelf = initial ? 'flex-start' : 'flex-end';

    this.mapPlaceholderRef.current.style.display = 'none';
    this.mapPosition = initial ? 'initial' : 'end';
  };

  handleScroll = () => {
    const fullHeight = document.body.scrollHeight;
    const scrolled = window.scrollY;

    if (this.mapPosition === 'initial') {
      if (scrolled >= 70) {
        this.fixMap();
        return;
      }
      return;
    }
    if (this.mapPosition === 'fixed') {
      if (scrolled + window.innerHeight >= fullHeight - 105) {
        this.unfixMap(false);
        return;
      }

      if (scrolled < 70) {
        this.unfixMap();
        return;
      }
      return;
    }
    if (scrolled + window.innerHeight < fullHeight - 105) {
      this.fixMap();
      return;
    }
  };

  createExternalService = () => {
    this.setState({
      modalOpen: true,
    });
  };

  closeExternalServiceModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  setMarkerHoverState(id, state) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker.id === id) {
          marker.hover = state;
        }
        return marker;
      }),
    });
  }

  onCardOver = e => {
    this.setMarkerHoverState(e, true);
  };

  onCardLeave = e => {
    this.setMarkerHoverState(e, false);
  };

  goBackToTrip = () => {
    this.props.resetTrip();
    if (this.props.routeState.tripId) {
      history.replace(`/trips/organize/${this.props.routeState.tripId}`);
      return;
    }
    history.replace('/trips/organize');
  };

  render() {
    const { props } = this;
    const { center, zoom, markers } = this.state;

    return (
      <Page topPush>
        <TopBar {...props} fixed />
        <span>
          <Filters {...props} />
          <Media query={`(min-width: 600px)`}>
            {matches =>
              matches ? (
                <MapToggle>
                  <Checkbox color="green" toggle onClick={this.toggleMap} /> &nbsp;&nbsp;
                  <div>
                    <h3 onClick={this.toggleMap}>Show Map</h3>
                  </div>
                </MapToggle>
              ) : (
                <span />
              )
            }
          </Media>
        </span>
        {props.routeState &&
          Boolean(props.routeState.tripId) && (
            <AddingServiceTopBar>
              <GoBackToTrip onClick={this.goBackToTrip}>Go back to trip</GoBackToTrip>
              <CreateService onClick={this.createExternalService}>
                I can't find my service
              </CreateService>
              {this.state.modalOpen && (
                <CreateServiceModal
                  day={props.routeState.day}
                  trip={props.trip}
                  goBackToTrip={this.goBackToTrip}
                  open={this.state.modalOpen}
                  closeModal={this.closeExternalServiceModal}
                />
              )}
            </AddingServiceTopBar>
          )}
        <PageContent flex>
          <ServicesWrapper>
            <Results
              {...props}
              onCardOver={this.onCardOver}
              onCardLeave={this.onCardLeave}
              data={props.service_data}
              showMap={this.state.showMap}
              goBackToTrip={this.goBackToTrip}
            />
          </ServicesWrapper>
          <MapPlaceholder ref={this.mapPlaceholderRef} />
          <MapWrapper ref={this.mapRef} style={{ display: this.state.showMap ? 'flex' : 'none' }}>
            <GoogleMapReact
              center={center}
              zoom={zoom}
              bootstrapURLKeys={{
                key: 'AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc',
              }}
              googleMapLoader={waitUntilMapsLoaded}
              options={
                window.google
                  ? {
                      zoomControlOptions: {
                        position: window.google.maps.ControlPosition.LEFT_CENTER,
                      },
                    }
                  : {}
              }
            >
              {markers.map(marker => (
                <MapMaker {...marker} scale={1} color="#4fb798" />
              ))}
            </GoogleMapReact>
          </MapWrapper>
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}
