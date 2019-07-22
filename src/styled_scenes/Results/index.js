// NPM
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Checkbox } from 'semantic-ui-react';
import { getCenterAndZoom, getCenterFromBounds } from 'libs/location';
import yelpLogo from 'assets/yelp/logo.png';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import tripActions from 'store/trips/actions';
import searchActions from 'store/search/actions';
import * as sessionActions from 'store/session/actions';
import { debounce } from 'lodash';
import pluralize from 'pluralize';
import Button from 'shared_components/Button';

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
import { primary, textLight } from 'libs/colors';
import { P, PStrong } from 'libs/commonStyles';
import Sort from './components/Sort';
import HelpMe from 'shared_components/HelpMe';
import { usingBoundingBox } from 'libs/search';
import urls from 'libs/urlGenerator';
import { googleMapsKey } from 'libs/config';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const mapHeight = 'calc(100vh - 66px)';

const MapWrapper = styled.div`
  display: none;
  ${media.minSmall} {
    display: ${props => (props.showing ? 'flex' : 'none')};
  }
  position: relative;
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

const FiltersWrapper = styled.div`
  margin-top: 10px;
  align-self: center;
  ${media.minMedium} {
    margin-top: 0;
    align-self: flex-start;
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

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 300px;
  color: ${textLight};
  pointer-events: none;
`;

const TopGrid = styled.div`
  display: grid;
  row-gap: 15px;
  grid-template-columns: 1fr;
  margin: 0 15px;
  ${props => props.showingMobile && 'grid-template-columns: 1fr;'} ${media.minMedium} {
    grid-template-columns: auto 1fr;
  }
`;

const SortWrapper = styled.div`
  justify-self: flex-start;
  align-self: flex-start;
  display: none;
  ${props => props.showingMobile && 'display: block;'} ${media.minMedium} {
    justify-self: flex-end;
    display: block;
  }
`;

const RightColumn = styled.div`
  align-self: flex-start;
  justify-self: flex-end;
  display: flex;
  align-items: center;
  position: absolute;
  right: 15px;
  ${media.minMedium} {
    grid-template-columns: auto 1fr;
    display: flex;
    position: relative;
    right: auto;
  }
`;

const AddingServiceTopBar = styled.div`
  display: none;
  align-items: flex-start;
  ${media.minMedium} {
    display: flex;
  }
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

const ByYelp = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: -10px;
  ${props => props.showingMobile && 'display: none;'} ${media.minMedium} {
    display: flex;
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
const defaultZoom = 10;

class ResultsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: defaultCenter,
      zoom: defaultZoom,
      markers: [],
      showMap: true,
      searchByMoving: true,
      showingFiltersMobile: false,
      updatingCenter: false, // used to get lat/lng and update if no results yet
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

  updateCenter = async (formattedAddress, countryCode, state, city) => {
    this.setState({
      updatingCenter: true,
    });
    const cityStr = city ? `${city}, ` : '';
    const stateStr = state ? `${state}, ` : '';
    const address = formattedAddress || `${cityStr}${stateStr}${countryCode}`;

    await waitUntilMapsLoaded();
    const results = await geocodeByAddress(address);
    const center = await getLatLng(results[0]);
    if (this.state.updatingCenter) {
      this.setState({
        center,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isBehindModal) {
      return;
    }
    if (nextProps.searchExtraData) {
      return;
    }

    if (nextProps.searchParams.locationSearchType === 'placeData') {
      if (
        nextProps.searchParams.countryCode !== this.props.searchParams.countryCode ||
        nextProps.searchParams.state !== this.props.searchParams.state ||
        nextProps.searchParams.city !== this.props.searchParams.city
      ) {
        this.updateCenter(
          nextProps.searchParams.address,
          nextProps.searchParams.countryCode,
          nextProps.searchParams.state,
          nextProps.searchParams.city,
        );
      }
    }
    if (nextProps.searchParams.locationSearchType === 'latlng') {
      if (
        nextProps.searchParams.lat !== this.props.searchParams.lat ||
        nextProps.searchParams.lng !== this.props.searchParams.lng
      ) {
        this.setState({
          center: {
            lat: nextProps.searchParams.lat,
            lng: nextProps.searchParams.lng,
          },
        });
      }
    }

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
        this.setState({ center, zoom, markers: newMarkers, updatingCenter: false });
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
    } else if (this.props.searchParams.locationSearchType === 'placeData') {
      this.updateCenter(
        this.props.searchParams.address,
        this.props.countryCode,
        this.props.state,
        this.props.city,
      );
    } else if (this.props.searchParams.locationSearchType === 'latlng') {
      this.setState({
        center: {
          lat: this.props.lat,
          lng: this.props.lng,
        },
      });
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

  onMobileFiltersToggle = value => {
    this.setState({
      showingFiltersMobile: value,
    });
  };

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
      history.replace(urls.trip.organize(this.props.routeState.tripId));
      return;
    }
    history.replace('/');
  };

  onChangeMap = ({ center, zoom, bounds }) => {
    if (zoom !== this.state.zoom && this.state.searchByMoving) {
      this.setState({ zoom, center });
      this.searchByBounds(bounds.ne.lat, bounds.ne.lng, bounds.sw.lat, bounds.sw.lng);
    }
  };

  onDragMap = debounce(map => {
    if (!this.state.searchByMoving) {
      return;
    }
    const bounds = map.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    this.searchByBounds(northEast.lat(), northEast.lng(), southWest.lat(), southWest.lng());
  }, 1000);

  searchByBounds = (northEastLat, northEastLng, southWestLat, southWestLng) => {
    this.props.updateSearchParams({
      ...this.props.searchParams,
      topRightLat: northEastLat,
      topRightLng: northEastLng,
      bottomLeftLat: southWestLat,
      bottomLeftLng: southWestLng,
      locationSearchType: 'bounds',
    });
  };

  render() {
    const { props } = this;
    const { center, zoom, markers, showingFiltersMobile } = this.state;
    const type = props.searchParams.type;

    return (
      <React.Fragment>
        <TopGrid showingMobile={showingFiltersMobile}>
          <FiltersWrapper>
            <Filters
              backToTrip={props.routeState && props.routeState.tripId}
              searchParams={props.searchParams}
              updateSearchParams={props.updateSearchParams}
              minPossiblePrice={props.minPossiblePrice}
              maxPossiblePrice={props.maxPossiblePrice}
              onMobileToggle={this.onMobileFiltersToggle}
            />
          </FiltersWrapper>
          <RightColumn>
            <MapToggle style={{ marginRight: '10px' }}>
              <Checkbox
                color="green"
                toggle
                checked={this.state.showMap}
                onClick={this.toggleMap}
              />{' '}
              &nbsp;&nbsp;
              <P onClick={this.toggleMap}>
                <Trans>Map</Trans>
              </P>
            </MapToggle>
            <HelpMe isLoadingUser={false} session={this.props.session} buttonSize="small" />
          </RightColumn>
          <AddingServiceTopBar>
            <P>
              {Boolean(props.count) && (
                <strong>
                  {props.count >= 1000 ? <Trans>More than</Trans> : ''} {props.count}{' '}
                  {props.count == 1 ? (
                    <Trans>
                      {type === 'food' ? (
                        <Trans>restaurant</Trans>
                      ) : type === 'activity' ? (
                        <Trans>activity</Trans>
                      ) : type === 'trip' ? (
                        <Trans>trip</Trans>
                      ) : type === 'accommodation' ? (
                        <Trans>accommodation</Trans>
                      ) : type === 'transport' ? (
                        <Trans>transport</Trans>
                      ) : (
                        { type }
                      )}{' '}
                      found.
                    </Trans>
                  ) : (
                    <Trans>
                      {type === 'food' ? (
                        <Trans>restaurants</Trans>
                      ) : type === 'activity' ? (
                        <Trans>activities</Trans>
                      ) : type === 'trip' ? (
                        <Trans>trips</Trans>
                      ) : type === 'accommodation' ? (
                        <Trans>accommodations</Trans>
                      ) : type === 'transport' ? (
                        <Trans>transports</Trans>
                      ) : (
                        { type }
                      )}{' '}
                      found.
                    </Trans>
                  )}
                </strong>
              )}{' '}
              {(props.routeState && props.routeState.tripId) || type === 'trip' ? (
                <>
                  <span>
                    <Trans>Not what you're looking for?</Trans>
                  </span>{' '}
                  {type !== 'trip' ? (
                    <CreateService onClick={this.createExternalService}>
                      <Trans>
                        Add{' '}
                        {type === 'food' ? (
                          <Trans>a place to eat</Trans>
                        ) : type === 'activity' ? (
                          <Trans>an activity</Trans>
                        ) : type === 'trip' ? (
                          <Trans>a trip</Trans>
                        ) : type === 'accommodation' ? (
                          <Trans>an accommodation</Trans>
                        ) : type === 'transport' ? (
                          <Trans>a transport</Trans>
                        ) : (
                          { type }
                        )}
                      </Trans>
                    </CreateService>
                  ) : (
                    <Link
                      to={{
                        pathname: '/new/trip',
                        state: {
                          modal: true,
                        },
                      }}
                    >
                      <Trans>Create your own trip</Trans>
                    </Link>
                  )}
                </>
              ) : null}
            </P>
            {this.state.modalOpen && (
              <CreateServiceModal
                day={props.routeState && props.routeState.day}
                trip={props.trip}
                goBackToTrip={this.goBackToTrip}
                open={this.state.modalOpen}
                closeModal={this.closeExternalServiceModal}
              />
            )}
          </AddingServiceTopBar>
          <SortWrapper showingMobile={showingFiltersMobile}>
            <Sort
              searchParams={this.props.searchParams}
              updateSearchParams={props.updateSearchParams}
            />
          </SortWrapper>
          {type === 'food' && (
            <ByYelp showingMobile={showingFiltersMobile}>
              <P style={{ marginBottom: 0 }}>
                <Trans>Restaurants provided by</Trans>
              </P>
              <a
                style={{ marginTop: '-25px', marginLeft: '-10px' }}
                href="https://yelp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img style={{ width: '100px' }} src={yelpLogo} alt="Yelp" />
              </a>
            </ByYelp>
          )}
        </TopGrid>
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
              getCurrentUserTrip={this.props.getCurrentUserTrip}
            />
          </ServicesWrapper>
          <MapPlaceholder ref={this.mapPlaceholderRef} />
          <MapWrapper ref={this.mapRef} showing={this.state.showMap}>
            <MapOptions>
              <I18n>
                {({ i18n }) => (
                  <Checkbox
                    onChange={this.onToggleSearchByMoving}
                    label={i18n._(t`Search as I move the map`)}
                    checked={this.state.searchByMoving}
                  />
                )}
              </I18n>
            </MapOptions>
            {this.props.searchExtraData && (
              <MapOverlay>
                {(this.props.searchExtraData.zoomOut || this.props.searchExtraData.zoomIn) &&
                  this.props.searchError}
              </MapOverlay>
            )}
            <GoogleMapReact
              center={center}
              zoom={zoom}
              bootstrapURLKeys={{
                key: googleMapsKey,
              }}
              googleMapLoader={waitUntilMapsLoaded}
              onDrag={this.onDragMap}
              onChange={this.onChangeMap}
              options={
                window.google && window.google.maps
                  ? {
                      minZoom: 1,
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
    searchError: state.search.error,
    searchExtraData: state.search.extraData,
    minPossiblePrice: state.search.minPrice,
    maxPossiblePrice: state.search.maxPrice,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchUserTrips: tripActions.fetchUserTrips,
      updateSearchParams: searchActions.updateSearchParams,
      getCurrentUserTrip: sessionActions.getCurrentUserTrip,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsScene);
