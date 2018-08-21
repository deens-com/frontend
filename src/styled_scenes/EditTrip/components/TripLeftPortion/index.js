import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';

import UserAvatar from 'shared_components/UserAvatar';
import ShareButton from 'styled_scenes/EditTrip/components/ShareButton';
import ChangeTripImageButton from 'styled_scenes/EditTrip/components/ChangeTripImageButton';
import MapMaker from 'shared_components/MapMarker';
import { sizes } from 'libs/styled';
import {
  LeftWrap,
  ShareWrap,
  DatesWrap,
  ProfileWrap,
  ActionsWrap,
  ShareBg,
  MapWrapper,
} from './styles';
import { getFormattedTripDates } from 'libs/Utils';
import EditTripContainer from 'scenes/trips/containers/EditTripContainer';

export default class TripLeftPortion extends Component {
  static propTypes = {
    trip: PropTypes.object.isRequired,
    scheduledServices: PropTypes.array.isRequired,
  };

  state = {
    center: { lat: 59.95, lng: 30.33 },
    zoom: 11,
  };

  componentDidMount() {
    const markers = this.getMarkerLatLngs(this.props);
    const centerZoomResult = this.getCenterAndZoom(markers);
    if (centerZoomResult) this.setState(centerZoomResult);
  }

  getMarkerLatLngs = props => {
    return props.scheduledServices.reduce(
      (markers, { day, services }) => [
        ...markers,
        ...services.map(({ objectId, latitude, longitude }) => ({
          key: `${objectId}-day${day}`,
          latitude,
          longitude,
        })),
      ],
      [],
    );
  };

  getCenterAndZoom = markers => {
    if (!markers.length) return;
    if (markers.length === 1) {
      const center = { lat: markers[0].latitude, lng: markers[0].longitude };
      return { center, zoom: 11 };
    }
    const bounds = new window.google.maps.LatLngBounds();
    for (const marker of markers) {
      bounds.extend(new window.google.maps.LatLng(marker.latitude, marker.longitude));
    }
    const newBounds = {
      ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
      sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
    };
    const size = { width: 800, height: 450 };
    const { center, zoom } = fitBounds(newBounds, size);
    return { center, zoom };
  };

  componentWillReceiveProps(nextProps) {
    const currentMarkers = this.getMarkerLatLngs(this.props);
    const newMarkers = this.getMarkerLatLngs(nextProps);
    if (currentMarkers.length !== newMarkers.length) {
      const centerZoomResult = this.getCenterAndZoom(newMarkers);
      this.setState(centerZoomResult);
    }
  }

  render() {
    const { trip } = this.props;
    const tripImage = (trip && trip.image) || 'https://dummyimage.com/1280x720/000/fff';
    return (
      <LeftWrap>
        <ShareWrap>
          <h3>{trip.title}</h3>
          <DatesWrap>
            {/* Not storing the formated date in state because it could change on dayCount or startDate change */}
            {/* and as this is the EditTrip page it's more likely to happen */}
            <p>{getFormattedTripDates(trip)}</p>
          </DatesWrap>
          <span>
            <ProfileWrap>
              <UserAvatar user={trip && trip.owner} usernameColor="#fff" />
            </ProfileWrap>
          </span>
          <ActionsWrap>
            <EditTripContainer.ContextConsumer>
              {context => (
                <React.Fragment>
                  <ShareButton
                    trip={trip}
                    updateTripDetails={context.updateTripDetails}
                    showTripStatusChanged={context.showTripStatusChanged}
                    onShareModalClose={context.onShareModalClose}
                  />
                  <ChangeTripImageButton
                    onImageSelect={context.onImageSelect}
                    isImageUploadInProgress={context.isImageUploadInProgress}
                  />
                </React.Fragment>
              )}
            </EditTripContainer.ContextConsumer>
          </ActionsWrap>
          <ShareBg src={tripImage} background />
        </ShareWrap>
        <Media
          query={`(min-width: ${sizes.medium})`}
          render={() => (
            <MapWrapper>
              <GoogleMapReact center={this.state.center} zoom={this.state.zoom}>
                {this.getMarkerLatLngs(this.props).map(({ key, latitude, longitude }) => (
                  <MapMaker key={key} lat={latitude} lng={longitude} scale={1} color="#4fb798" />
                ))}
              </GoogleMapReact>
            </MapWrapper>
          )}
        />
      </LeftWrap>
    );
  }
}
