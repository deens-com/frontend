// NPM
import React, { Component } from 'react';
//import Media from 'react-media';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { Checkbox } from 'semantic-ui-react';
import Media from 'react-media';
import { getCenterAndZoom, getCenterFromBounds } from 'libs/location';
import yelpLogo from 'assets/yelp/logo.png';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import tripActions from 'store/trips/actions';
import searchActions from 'store/search/actions';
import debounce from 'lodash.debounce';

import history from 'main/history';
// COMPONENTS
import Filters from './components/Filters';
import Results from './components/Results';
import MapMaker from './../../shared_components/MapMarker';
import CreateServiceModal from './components/CreateServiceModal';

// ACTIONS/CONFIG
import { media } from '../../libs/styled';
import { waitUntilMapsLoaded } from 'libs/Utils';
// import { foodList } from "../../data/food";

// STYLES
import { PageContent } from './../../shared_components/layout/Page';
import { primary } from 'libs/colors';
import { P } from 'libs/commonStyles';
import Sort from './components/Sort';
import HelpMe from 'shared_components/HelpMe';
import { usingBoundingBox } from 'libs/search';

import addPrefixArticle from 'indefinite';

const mapHeight = 'calc(100vh - 66px)';

const MapWrapper = styled.div`
  display: none;
  ${media.minSmall} {
    display: ${props => (props.showing ? 'flex' : 'none')};
  }
  align-items: center;
  justify-content: center;
  height: ${mapHeight};
  right: 0;
  margin-top: 26px;
  position: relative;
  width: 100%;
  max-width: 700px;
  h3 {
    color: #fff;
    font-size: 52px;
    text-align: center;
    max-width: 400px;
  }
`;

const MapPlaceholder = styled.div`
  display: none;
  ${media.minSmall} {
    width: 100%;
    height: ${mapHeight};
    max-width: 700px;
  }
`;

const ServicesWrapper = styled.div`
  width: 100%;

  ${media.minLarge} {
    // width: 58%;
  }
`;

const TopFiltersWrapper = styled.div``;

const RightColumn = styled.div`
  align-self: flex-start;
  flex-direction: column;
  > *:first-child {
    margin-bottom: 10px;
  }
`;

const AddingServiceTopBar = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 15px;
`;

const CreateService = styled.span`
  color: ${primary};
  margin-top: 15px;
  cursor: pointer;
`;

const MapToggle = styled.div`
  display: none;
  ${media.minSmall} {
    display: flex;
  }
  cursor: pointer;
`;

const TopFilters = styled.div`
  display: flex;
  margin: 0 15px;
  align-items: center;
`;

const ByYelp = styled.div`
  display: flex;
  align-items: center;
  margin: -10px 15px;
  > p {
    margin-top: 10px;
  }
  img {
    width: 100px;
  }
`;

const FirstLineRightColumn = styled.div`
  display: flex;
  align-items: center;
  > *:not(:first-child) {
    margin-left: 10px;
  }
`;

const MapOptions = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  background-color: white;
  padding: 3px 5px;
  border-radius: 2px 2px 2px 0;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px 0px 2px rgba(0, 0, 0, 0.1);
`;

const defaultCenter = {
  lat: 48.856614,
  lng: 2.3522219000000177,
};
const defaultZoom = 11;

class ResultsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: defaultCenter,
      zoom: defaultZoom,
      markers: [],
      showMap: true,
      searchByMoving: true,
    };
    this.mapRef = React.createRef();
    this.mapPlaceholderRef = React.createRef();
    this.mapPosition = 'initial';
  }

  static propTypes = {};

  getMarkerLatLngs = props => {
    return props.service_data
      .filter(({ latitude, longitude }) => latitude && longitude)
      .map(service => ({
        key: service._id,
        lat: parseFloat(service.geo.lat),
        lng: parseFloat(service.geo.lng),
        name: service.name,
        id: service._id,
        hover: false,
      }));
  };

  getCenterAndZoom = (markers, props) => {
    const center =
      props.latitude && props.longitude
        ? { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) }
        : this.state.center;

    return getCenterAndZoom(markers, center);
  };

  componentWillReceiveProps(nextProps) {
    const hasLocationsChanged =
      nextProps.service_data.map(item => item._id).join(',') !==
      this.props.service_data.map(item => item._id).join(',');

    if (hasLocationsChanged) {
      const newMarkers = this.getMarkerLatLngs(nextProps);
      if (newMarkers.length === 0) {
        this.setState({ markers: newMarkers });
        return;
      }
      if (!usingBoundingBox(nextProps.searchParams)) {
        const { center, zoom } = this.getCenterAndZoom(newMarkers, nextProps);
        this.setState({ center, zoom, markers: newMarkers });
      } else {
        this.setState({ markers: newMarkers });
      }
    }
  }

  componentDidMount() {
    this.props.fetchUserTrips();
    if (usingBoundingBox(this.props.searchParams)) {
      getCenterFromBounds(this.props.searchParams).then(({ center, zoom }) =>
        this.setState({ center, zoom, markers: [] }),
      );
    } else {
      const { center, zoom } = this.getCenterAndZoom([], this.props);
      this.setState({ center, zoom, markers: [] });
    }
    if (this.state.showMap) {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('scroll', this.resizeHandler);
    }
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

  onToggleSearchByMoving = () => {
    this.setState(prevState => ({
      searchByMoving: !prevState.searchByMoving,
    }));
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
    style.height = mapHeight;
    style.marginTop = '0';
    style.top = '70px';

    this.mapPlaceholderRef.current.style.display = 'flex';
    this.mapPosition = 'fixed';
  };

  unfixMap = (initial = true) => {
    const style = this.mapRef.current.style;
    style.position = 'relative';
    style.width = '100%';
    style.height = mapHeight;
    style.marginTop = initial ? '26px' : '0';
    style.top = initial ? '0' : null;
    style.alignSelf = initial ? 'flex-start' : 'flex-end';

    this.mapPlaceholderRef.current.style.display = 'none';
    this.mapPosition = initial ? 'initial' : 'end';
  };

  handleScroll = () => {
    const fullHeight = document.body.scrollHeight;
    const scrolled = window.scrollY;
    const initialCondition = scrolled < 112;
    const endCondition = scrolled + window.innerHeight >= fullHeight - 245;

    if (this.mapPosition === 'initial') {
      if (!initialCondition) {
        if (endCondition) {
          this.unfixMap(false);
          return;
        }
        this.fixMap();
        return;
      }
      return;
    }
    if (this.mapPosition === 'fixed') {
      if (endCondition) {
        this.unfixMap(false);
        return;
      }

      if (initialCondition) {
        this.unfixMap();
        return;
      }
      return;
    }

    if (!endCondition) {
      if (initialCondition) {
        this.unfixMap();
        return;
      }
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

  onChangeMap = debounce(map => {
    if (!this.state.searchByMoving) {
      return;
    }

    const bounds = map.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    this.props.updateSearchParams({
      topLeftLat: northEast.lat(),
      topLeftLng: northEast.lng(),
      bottomRightLat: southWest.lat(),
      bottomRightLng: southWest.lng(),
    });
  }, 1000);

  render() {
    const { props } = this;
    const { center, zoom, markers } = this.state;
    console.log(zoom);
    const type = props.searchParams.type;
    return (
      <React.Fragment>
        <TopFiltersWrapper>
          <TopFilters>
            <Filters
              backToTrip={props.routeState && props.routeState.tripId}
              searchParams={props.searchParams}
              updateSearchParams={props.updateSearchParams}
            />
            <RightColumn>
              <FirstLineRightColumn>
                <HelpMe isLoadingUser={false} session={this.props.session} buttonSize="small" />
                <MapToggle>
                  <Checkbox
                    color="green"
                    toggle
                    checked={this.state.showMap}
                    onClick={this.toggleMap}
                  />{' '}
                  &nbsp;&nbsp;
                  <P onClick={this.toggleMap}>Show Map</P>
                </MapToggle>
              </FirstLineRightColumn>
              <Sort
                searchParams={this.props.searchParams}
                updateSearchParams={props.updateSearchParams}
              />
            </RightColumn>
          </TopFilters>
        </TopFiltersWrapper>
        {props.routeState &&
          Boolean(props.routeState.tripId) && (
            <AddingServiceTopBar>
              <P>
                {Boolean(props.count) && (
                  <strong>
                    {props.count >= 1000
                      ? `More than ${props.count} found.`
                      : `${props.count} found.`}
                  </strong>
                )}{' '}
                <span>Still not satisfied?</span>{' '}
                {type !== 'trip' ? (
                  <CreateService onClick={this.createExternalService}>
                    Add {type !== 'food' ? addPrefixArticle(type) : type}
                  </CreateService>
                ) : (
                  <CreateService onClick={this.createExternalService}>
                    Create your own trip
                  </CreateService>
                )}
              </P>
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
        {type === 'food' && (
          <ByYelp>
            <P>Restaurants provided by</P>
            <a href="https://yelp.com" target="_blank" rel="noopener noreferrer">
              <img src={yelpLogo} alt="Yelp" />
            </a>
          </ByYelp>
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
              updateSearchParams={props.updateSearchParams}
              userTrips={this.props.userTrips}
            />
          </ServicesWrapper>
          <MapPlaceholder ref={this.mapPlaceholderRef} />
          <MapWrapper ref={this.mapRef} showing={this.state.showMap}>
            <MapOptions>
              <Checkbox
                onChange={this.onToggleSearchByMoving}
                label="Search as I move the map"
                checked={this.state.searchByMoving}
              />
            </MapOptions>
            <GoogleMapReact
              center={center}
              zoom={zoom}
              bootstrapURLKeys={{
                key: 'AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc',
              }}
              googleMapLoader={waitUntilMapsLoaded}
              onDrag={this.onChangeMap}
              options={
                window.google && window.google.maps
                  ? {
                      zoomControlOptions: {
                        position: window.google.maps.ControlPosition.LEFT_CENTER,
                      },
                    }
                  : {}
              }
            >
              {markers.map(marker => (
                <MapMaker {...marker} scale={1} color="#65AFBB" />
              ))}
            </GoogleMapReact>
          </MapWrapper>
        </PageContent>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userTrips: state.trips.userTrips.unbookedTrips,
    session: state.session.session,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchUserTrips: tripActions.fetchUserTrips,
      updateSearchParams: searchActions.updateSearchParams,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsScene);
