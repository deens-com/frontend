import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import axios from 'libs/axios';

import { Page, PageContent } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import { SectionWrap } from 'shared_components/layout/Page';
import UserBasicInfo from 'styled_scenes/Account/components/UserBasicInfo';
import TripSectionComponent from 'styled_scenes/Account/Trips/shared/TripSectionComponent';

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
        const res = await axios.get('/trips', {
          params: { include: 'services', page: this.state.page },
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
      <div>
        <Page>
          <TopBar />
          <PageContent padding="24px">
            <Grid centered columns={2}>
              <Grid.Column mobile={16} tablet={5} computer={4}>
                <SectionWrap>
                  <UserBasicInfo user_profile={this.props.user} />
                </SectionWrap>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={11} computer={12}>
                <h1>My Trips</h1>
                <TripSectionComponent
                  isLoadingTrips={this.state.isLoading}
                  trips={this.state.trips}
                  totalTrips={this.state.count}
                  fetchTrips={this.loadTrips}
                />
              </Grid.Column>
            </Grid>
          </PageContent>
        </Page>
      </div>
    );
  }
}

export default withRouter(AccountTripsScene);
