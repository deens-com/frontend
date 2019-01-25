import React, { Component } from 'react';
import HomeComponent from './../components/Home';
import { Helmet } from 'react-helmet';
import { websiteUrl } from 'libs/config';
import api from 'libs/apiClient';
import fetchHelperFactory, { defaultState } from 'libs/fetchHelper';

export default class HomeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trips: defaultState,
    };

    this.fetchTrips = fetchHelperFactory(this.setState.bind(this), 'trips', api.search.get);
  }
  componentDidMount() {
    this.fetchTrips({ include: 'owner' });
  }

  getTrips = () => {
    this.setState(
      {
        trip: defaultState,
      },
      () => this.fetchTrips({ include: 'owner' }),
    );
  };

  render() {
    return (
      <div className="HomeContainer">
        <Helmet>
          <title>Please, plan my trip!</title>
          <link rel="canonical" href={websiteUrl} />
        </Helmet>
        <HomeComponent
          trips={this.state.trips.data && this.state.trips.data.trips}
          isLoading={this.state.trips.isLoading}
          retryFunction={this.getTrips}
        />
      </div>
    );
  }
}
