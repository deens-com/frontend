// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Media from "react-media";
import GoogleMapReact from "google-map-react";
import moment from "moment";

// COMPONENTS
import BrandFooter from "../../shared_components/BrandFooter";
import TopBar from "./../../shared_components/TopBarWithSearch";
import Results from "./components/Results";
import ToolBar from "./components/ToolBar";
import Summary from "./components/Summary";
import MapMaker from "../../shared_components/MapMarker";
import Button from "../../shared_components/Button";
import Stars from '../../shared_components/Rating/Stars';
import UserAvatar from '../../shared_components/UserAvatar';

// ACTIONS/CONFIG
import { media, sizes } from "../../libs/styled";
import { tripsData } from "../../data/home";
import { trip } from "../../data/trip";

// STYLES
import { Page, PageContent } from "../../shared_components/layout/Page";
import { Hr } from "../../shared_components/styledComponents/misc";

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

const FirstLine = styled.span`
  font-size: 40px;
  display: block;
`;

const SecondLine = styled.span`
  font-size: 20px;
  display: block;
`;

const DatesWrap = styled.div`
  margin: 25px 0;
`;

const PublisherWrap = styled.div`
  margin: 25px 0;
`;

const ActionsWrap = styled.div`
  & > div:first-child {
    margin-right: 15px;
  }
`;

const ShareBg = styled.div`
  position: absolute;
  background: url(${props => props.url || "#"}) no-repeat;
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

const Avatar = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  overflow: hidden;
  border: 2px solid #d7dbdf;
  margin-right: 15px;
`;

const Profile = styled.div`
  display: inline-block;

  span {
    display: block;

    &:last-child {
      padding-top: 5px;
      font-size: 14px;
      color: #6e7885;
    }
  }
`;

// MODULE
export default class TripsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      startDate: "",
      endDate: "",
      person: 1,
      details: true
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  onSubmit(ev) {
    alert(JSON.stringify(this.state));
  }

  onValueChange(key, value) {
    this.setState({ [key]: value });
  }

  toggleDetails() {
    this.setState({ details: !this.state.details });
  }

  render() {
    return (
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent>
          <Wrap>
            <LeftWrap>
              <ShareWrap>
                <h3>
                  <FirstLine>My trip</FirstLine>
                  <SecondLine>to</SecondLine>{this.props.trip.title}
                </h3>
                <DatesWrap>
                  <p>{this.props.trip && this.props.trip.beginDate && moment(this.props.trip.beginDate.iso).format("MMM Do YY")} - {this.props.trip && this.props.trip.endDate && moment(this.props.trip.endDate.iso).format("MMM Do YY")}</p>
                </DatesWrap>
                <span>
                  <ProfileWrap>
                    <UserAvatar user={this.props.trip && this.props.trip.owner} usernameColor="#fff" />
                  </ProfileWrap>
                </span>
                <ActionsWrap>
                  <Button
                    onClick={ev => {
                      alert("adding trip");
                    }}
                    type="button"
                    text="Share the trip"
                    iconAfter="arrowDown"
                  />
                  <Button
                    onClick={ev => {
                      alert("adding trip");
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
                    <GoogleMapReact
                      defaultCenter={{ lat: 59.95, lng: 30.33 }}
                      defaultZoom={11}
                    >
                      <MapMaker
                        lat={59.95}
                        lng={30.33}
                        scale={1}
                        color="#4fb798"
                      />
                      <MapMaker
                        lat={59.96}
                        lng={30.34}
                        scale={1}
                        color="#4fb798"
                      />
                      <MapMaker
                        lat={59.96}
                        lng={30.3}
                        scale={1}
                        color="#4fb798"
                      />
                      <MapMaker
                        lat={59.97}
                        lng={30.31}
                        scale={1}
                        color="#4fb798"
                      />
                    </GoogleMapReact>
                  </MapWrapper>
                )}
              />
            </LeftWrap>
            <TripWrapper>
              <ToolBar
                onSubmit={this.onSubmit}
                onValueChange={this.onValueChange}
                state={this.state}
              />
              <Results showDetails={this.state.details} tripData={this.props.trip} />
              <Hr />
              <Summary data={trip} />
            </TripWrapper>
          </Wrap>
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}

// Props Validation
TripsScene.propTypes = {};
