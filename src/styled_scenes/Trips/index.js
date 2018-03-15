// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import BrandFooter from '../../components/BrandFooter';
import TopBar from '../../components/TopBar';
import Results from './components/Results';
import ToolBar from './components/ToolBar';

// ACTIONS/CONFIG
import { media } from '../../libs/styled';
import { tripsData } from '../../data/home';

// STYLES
import { Page, PageContent } from '../../components/layout/Page';

const MapWrapper = styled.div`
  display: none;

  ${media.minMedium} {
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
  }
`;

const TripWrapper = styled.div`
  width: 100%;

  ${media.minMedium} {
    width: 58%;
  }
`;

// MODULE
export default class TripsScene extends Component {
  constructor() {
    super();
    this.state = {
      location: '',
      startDate: '',
      endDate: '',
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
          <MapWrapper>
            <h3>Start planning your Deram trip</h3>
          </MapWrapper>
          <TripWrapper>
            <ToolBar
              onSubmit={this.onSubmit}
              onValueChange={this.onValueChange}
              state={this.state}
            />
            <Results
              data={tripsData}
              toggleDetails={this.toggleDetails}
              showDetails={this.state.details}
            />
          </TripWrapper>
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </Page>
    );
  }
}

// Props Validation
TripsScene.propTypes = {};
