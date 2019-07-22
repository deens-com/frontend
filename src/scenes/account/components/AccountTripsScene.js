import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { PageContent } from 'shared_components/layout/Page';
import { SectionWrap } from 'shared_components/layout/Page';
import UserBasicInfo from 'styled_scenes/Account/components/UserBasicInfo';
import TripSectionComponent from 'styled_scenes/Account/Trips/shared/TripSectionComponent';
import apiClient from 'libs/apiClient';

// i18n
import { I18n } from '@lingui/react';
import { Trans } from '@lingui/macro';

class AccountTripsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      trips: [],
      page: 0,
      count: null,
      limit: 10,
    };
  }

  onDelete = id => {
    const index = this.state.trips.findIndex(trip => trip._id === id);
    const tripToDelete = this.state.trips[index];
    this.setState(prevState => ({
      trips: prevState.trips.filter(trip => trip._id !== id),
    }));
    apiClient.trips.delete(id).catch(() => {
      this.setState(prevState => ({
        trips: [...prevState.trips.slice(0, index), tripToDelete, ...prevState.trips.slice(index)],
      }));
    });
  };

  loadTrips = () => {
    if (this.state.isLoading) {
      return;
    }
    this.setState(
      prevState => ({
        isLoading: true,
        page: prevState.page + 1,
      }),
      async () => {
        const res = await apiClient.trips.get({
          include: 'services',
          page: this.state.page,
        });

        this.setState(prevState => ({
          isLoading: false,
          trips: [...prevState.trips, ...res.data.trips],
          count: res.data.count,
        }));
      },
    );
  };

  render() {
    return (
      <PageContent padding="24px">
        <Grid centered columns={2}>
          <Grid.Column mobile={16} tablet={5} computer={4}>
            <SectionWrap>
              <UserBasicInfo user_profile={this.props.user} />
            </SectionWrap>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={11} computer={12}>
            <h1>
              <Trans>My Trips</Trans>
            </h1>
            <TripSectionComponent
              isLoadingTrips={this.state.isLoading}
              trips={this.state.trips}
              totalTrips={this.state.count}
              fetchTrips={this.loadTrips}
              onDelete={this.onDelete}
            />
          </Grid.Column>
        </Grid>
      </PageContent>
    );
  }
}

export default withRouter(AccountTripsScene);
