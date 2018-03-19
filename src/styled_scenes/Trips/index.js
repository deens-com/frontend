// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Media from "react-media";
import GoogleMapReact from "google-map-react";

// COMPONENTS
import BrandFooter from "../../components/BrandFooter";
import TopBar from "../../components/TopBar";
import Results from "./components/Results";
import ToolBar from "./components/ToolBar";
import Summary from "./components/Summary";
import MapMaker from "../../components/MapMarker";

// ACTIONS/CONFIG
import { media, sizes } from "../../libs/styled";
import { tripsData } from "../../data/home";
import { trip } from "../../data/trip";

// STYLES
import { Page, PageContent } from "../../components/layout/Page";
import { Hr } from "../../components/styledComponents/misc";

const MapWrapper = styled.div`
  height: 100vh;
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

const TripWrapper = styled.div`
  width: 100%;

  ${media.minMediumPlus} {
    width: 58%;
  }
`;

// MODULE
export default class TripsScene extends Component {
  constructor() {
    super();
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
        <PageContent flex>
          <Media
            query={`(min-width: ${sizes.medium})`}
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
          <TripWrapper>
            <ToolBar
              onSubmit={this.onSubmit}
              onValueChange={this.onValueChange}
              state={this.state}
            />
            <Results showDetails={this.state.details} />
            <Hr />
            <Summary data={trip} />
          </TripWrapper>
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}

// Props Validation
TripsScene.propTypes = {};
