// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import GoogleMapReact from 'google-map-react';
import moment from 'moment';

// COMPONENTS
import BrandFooter from '../../shared_components/BrandFooter';
import TopBar from './../../shared_components/TopBarWithSearch';
import Results from './components/Results';
import ToolBar from './components/ToolBar';
import Summary from './components/Summary';
import MapMaker from '../../shared_components/MapMarker';
import Button from '../../shared_components/Button';
import UserAvatar from '../../shared_components/UserAvatar';
import ShareButton from './components/ShareButton';

// ACTIONS/CONFIG
import { media, sizes } from '../../libs/styled';

// STYLES
import { Page, PageContent } from '../../shared_components/layout/Page';
import { Hr } from '../../shared_components/styledComponents/misc';
import { oneWayDiff } from '../../libs/Utils';

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
  & > div:first-child {
    margin-right: 15px;
  }
`;

const ShareBg = styled.div`
  position: absolute;
  background: url(${props => props.url || '#'}) no-repeat;
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

// MODULE
export default class TripsScene extends Component {
  state = {
    details: true,
  };

  onSubmit = ev => {
    const { query } = this.props;
    this.props.updateTripDetails(
      { beginDate: query.startDate, endDate: query.endDate, numberOfPerson: query.person.value },
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

  getBeginDate = trip => {
    if (!trip) trip = this.props.trip;
    return trip && trip.beginDate && trip.beginDate.iso;
  };

  getEndDate = trip => {
    if (!trip) trip = this.props.trip;
    return trip && trip.endDate && trip.endDate.iso;
  };

  componentWillReceiveProps(nextProps) {
    const { query, updateTripQuery } = this.props;
    const { trip } = nextProps;
    let beginDate,
      endDate,
      person = query.person;
    const isDifferentTrip = (this.props.trip && this.props.trip.objectId) !== (trip && trip.objectId);
    if (!query.startDate || isDifferentTrip) {
      const isoBeginDate = this.getBeginDate(trip);
      beginDate = isoBeginDate && moment(isoBeginDate).toDate();
    }
    if (!query.endDate || isDifferentTrip) {
      const isoEndDate = this.getEndDate(trip);
      endDate = isoEndDate && moment(isoEndDate).toDate();
    }
    if ((!query.person || !query.person.value) && trip.numberOfPerson) {
      person = { label: trip.numberOfPerson, value: trip.numberOfPerson };
    }
    const diff = oneWayDiff(query, {
      startDate: beginDate || query.startDate,
      endDate: endDate || query.endDate,
      person,
    });
    if (Object.keys(diff).length) {
      // dispatch update only if there's an update
      updateTripQuery(diff);
    }
  }

  render() {
    const beginDate = this.getBeginDate();
    const endDate = this.getEndDate();
    const { query } = this.props;
    return (
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent>
          <Wrap>
            <LeftWrap>
              <ShareWrap>
                <h3>
                  {this.props.trip.title}
                </h3>
                <DatesWrap>
                  <p>
                    {beginDate && moment(beginDate).format('MMM Do YY')} -{' '}
                    {endDate && moment(endDate).format('MMM Do YY')}
                  </p>
                </DatesWrap>
                <span>
                  <ProfileWrap>
                    <UserAvatar user={this.props.trip && this.props.trip.owner} usernameColor="#fff" />
                  </ProfileWrap>
                </span>
                <ActionsWrap>
                  <ShareButton trip={this.props.trip} updateTripDetails={this.props.updateTripDetails} />
                  <Button
                    onClick={ev => {
                      alert('adding trip');
                    }}
                    type="button"
                    text="Print"
                    theme="whiteTransparent"
                  />
                </ActionsWrap>
                <ShareBg url="/img/food/mamamia.jpg" />
              </ShareWrap>
              <Media
                query={`(min-width: ${sizes.medium})`}
                render={() => (
                  <MapWrapper>
                    <GoogleMapReact defaultCenter={{ lat: 59.95, lng: 30.33 }} defaultZoom={11}>
                      <MapMaker lat={59.95} lng={30.33} scale={1} color="#4fb798" />
                      <MapMaker lat={59.96} lng={30.34} scale={1} color="#4fb798" />
                      <MapMaker lat={59.96} lng={30.3} scale={1} color="#4fb798" />
                      <MapMaker lat={59.97} lng={30.31} scale={1} color="#4fb798" />
                    </GoogleMapReact>
                  </MapWrapper>
                )}
              />
            </LeftWrap>
            <TripWrapper>
              <ToolBar
                onSubmit={this.onSubmit}
                onValueChange={this.onValueChange}
                state={query}
                trip={this.props.trip}
                showTripUpdated={this.props.showTripUpdated}
                onCheckAvailabilityClick={this.checkAvailability}
                serviceAvailabilityCheckInProgress={this.props.serviceAvailabilityCheckInProgress}
              />
              <Results
                trip={this.props.trip}
                showDetails={this.state.details}
                scheduledServices={this.props.scheduledServices}
                unScheduledServices={this.props.unScheduledServices}
                onServiceDragEnd={this.props.onServiceDragEnd}
                onServiceRemoveClick={this.props.onServiceRemoveClick}
              />
              <Hr />
              <Summary
                trip={this.props.trip}
                scheduledServices={this.props.scheduledServices}
                unScheduledServices={this.props.unScheduledServices}
                onBookClick={this.props.onBookClick}
                isCloningInProcess={this.props.isCloningInProcess}
                query={query}
              />
            </TripWrapper>
          </Wrap>
        </PageContent>
        <BrandFooter withTopBorder withPadding />
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
};
