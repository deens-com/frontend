// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import moment from 'moment';
import Parse from 'parse';
import { Divider, Message } from 'semantic-ui-react';
import Tag from './../Service/components/Tag';
// COMPONENTS
import TopBar from './../../shared_components/TopBarWithSearch';
import Results from './components/Results';
import ToolBar from './components/ToolBar';
import Summary from './components/Summary';
import MapMaker from '../../shared_components/MapMarker';
import UserAvatar from '../../shared_components/UserAvatar';
import ShareButton from './components/ShareButton';
import Image from 'shared_components/Image';

// ACTIONS/CONFIG
import { media, sizes } from '../../libs/styled';

// STYLES
import { Page, PageContent } from '../../shared_components/layout/Page';
import { Hr } from '../../shared_components/styledComponents/misc';
import ChangeTripImageButton from './components/ChangeTripImageButton';
import Button from '../../shared_components/Button';

const Wrap = styled.div`
  ${media.minMediumPlus} {
    display: flex;
  }
`;

const LeftWrap = styled.div`
  width: 100%;

  ${media.minMediumPlus} {
    width: 42%;
  }
`;

const ShareWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 0;
  color: white;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000);

  ${media.minMedium} {
    min-height: 450px;
    padding: 0;
  }

  h3 {
    text-align: center;
    font-size: 50px;
  }
`;

const DatesWrap = styled.div`
  margin: 25px 0;
`;

const ActionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div:first-child {
    margin-bottom: 15px;
  }
`;

const ShareBg = styled(Image)`
  position: absolute;
  background-size: cover;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

const MapWrapper = styled.div`
  height: 450px;
  width: 100%;
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

const TripWrapper = styled.div`
  width: 100%;

  ${media.minMediumPlus} {
    width: 58%;
  }
`;

const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const TagsWrapper = styled.section`
  margin-left: 20px;
`;
// MODULE
export default class TripsScene extends Component {
  state = {
    details: true,
    center: { lat: 59.95, lng: 30.33 },
    zoom: 11,
    isOwner: false,
  };

  componentDidMount() {
    this.setState({ isOwner: false });
  }

  onSubmit = ev => {
    const { query } = this.props;
    this.props.updateTripDetails(
      {
        title: query.title,
        beginDate: query.startDate,
        endDate: query.endDate,
        numberOfPerson: query.person.value,
        formattedAddress: query.formattedAddress,
        latitude: query.latlng && query.latlng.lat,
        longitude: query.latlng && query.latlng.lng,
        city: query.city,
        country: query.country,
      },
      true
    );
  };

  checkAvailability = () => {
    const { query } = this.props;
    this.props.checkAvailability(query.startDate, parseInt(query.person.label, 10));
  };

  onValueChange = (key, value) => {
    this.props.updateTripQuery({ [key]: value });
  };

  toggleDetails = () => {
    this.setState({ details: !this.state.details });
  };

  componentWillReceiveProps(nextProps) {
    const { trip } = nextProps;
    const tripOwnerId = trip && trip.owner && trip.owner.objectId;
    const currentUser = Parse.User.current();
    const isOwner = tripOwnerId === (currentUser && currentUser.id);

    const currentMarkers = this.getMarkerLatLngs(this.props);
    const newMarkers = this.getMarkerLatLngs(nextProps);
    let centerZoomResult = {};
    if (currentMarkers.length !== newMarkers.length) {
      centerZoomResult = this.getCenterAndZoom(newMarkers);
    }
    this.setState({ isOwner, ...centerZoomResult });
  }

  getMarkerLatLngs = props => {
    return props.scheduledServices.reduce(
      (markers, { services }) => [...markers, ...services.map(({ latitude, longitude }) => ({ latitude, longitude }))],
      []
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

  render() {
    const { query, trip } = this.props;

    return (
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent loading={this.props.isPageLoading}>
          <Wrap>
            <LeftWrap>
              <ShareWrap>
                <h3>{trip.title}</h3>
                <DatesWrap>
                  <p>
                    {query.startDate && moment(query.startDate).format('MMM Do YY')} -{' '}
                    {query.endDate && moment(query.endDate).format('MMM Do YY')}
                  </p>
                </DatesWrap>
                <span>
                  <ProfileWrap>
                    <UserAvatar user={trip && trip.owner} usernameColor="#fff" />
                  </ProfileWrap>
                </span>
                <ActionsWrap>
                  <ShareButton
                    trip={trip}
                    updateTripDetails={this.props.updateTripDetails}
                    showTripStatusChanged={this.props.showTripStatusChanged}
                    onShareModalClose={this.props.onShareModalClose}
                  />
                  {
                    this.state.isOwner &&
                    <Button type='button' text='Edit Trip'
                      onClick={() => this.props.history.push('/trips/' + trip.objectId + '/edit')}
                      />
                  }
                  <br/>
                  <ChangeTripImageButton
                    trip={trip}
                    isOwner={this.state.isOwner}
                    onImageSelect={this.props.onImageSelect}
                    isImageUploadInProgress={this.props.isImageUploadInProgress}
                  />
                </ActionsWrap>
                <ShareBg
                  src={
                    (trip && trip.picture && trip.picture.url) || 'https://please-com.imgix.net/static/food/mamamia.jpg'
                  }
                  background
                />
              </ShareWrap>
              <Media
                query={`(min-width: ${sizes.medium})`}
                render={() => (
                  <MapWrapper>
                    <GoogleMapReact center={this.state.center} zoom={this.state.zoom}>
                      {this.getMarkerLatLngs(this.props).map(({ latitude, longitude }) => (
                        <MapMaker
                          key={`${latitude}-${longitude}`}
                          lat={latitude}
                          lng={longitude}
                          scale={1}
                          color="#4fb798"
                        />
                      ))}
                    </GoogleMapReact>
                  </MapWrapper>
                )}
              />
            </LeftWrap>
            <TripWrapper>
              {trip.booked && this.state.isOwner ? (
                <Message>This trip has already been booked on {moment(query.startDate).format('Do MMM YYYY')}.</Message>
              ) : null}
              <ToolBar
                onSubmit={this.onSubmit}
                onValueChange={this.onValueChange}
                state={query}
                trip={trip}
                onCheckAvailabilityClick={this.checkAvailability}
                isOwner={this.state.isOwner}
                serviceAvailabilityCheckInProgress={this.props.serviceAvailabilityCheckInProgress}
              />
              <TagsWrapper>
                {trip.tags &&
                  trip.tags.map(tag => <Tag item={tag} href={`/results?tags=${tag.label}`} key={tag.label} />)}
              </TagsWrapper>
              <Divider horizontal>Trip itinerary</Divider>
              <Results
                trip={trip}
                showDetails={this.state.details}
                scheduledServices={this.props.scheduledServices}
                unScheduledServices={this.props.unScheduledServices}
                onServiceDragEnd={this.props.onServiceDragEnd}
                onServiceRemoveClick={this.props.onServiceRemoveClick}
              />
              <Hr />
              <Summary
                trip={trip}
                scheduledServices={this.props.scheduledServices}
                unScheduledServices={this.props.unScheduledServices}
                isOwner={this.state.isOwner}
                onBookClick={this.props.onBookClick}
                isCloningInProcess={this.props.isCloningInProcess}
                query={query}
              />
            </TripWrapper>
          </Wrap>
        </PageContent>
      </Page>
    );
  }
}

// Props Validation
TripsScene.propTypes = {
  trip: PropTypes.object,
  scheduledServices: PropTypes.array,
  unScheduledServices: PropTypes.array,
  onServiceDragEnd: PropTypes.func.isRequired,
  onServiceRemoveClick: PropTypes.func.isRequired,
  updateTripDetails: PropTypes.func.isRequired,
  onBookClick: PropTypes.func.isRequired,
  isCloningInProcess: PropTypes.bool.isRequired,
  serviceAvailabilityCheckInProgress: PropTypes.bool.isRequired,
  onShareModalClose: PropTypes.func.isRequired,
  onImageSelect: PropTypes.func.isRequired,
  isImageUploadInProgress: PropTypes.bool.isRequired,
};
