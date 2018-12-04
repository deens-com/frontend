import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import history from 'main/history';

import { Page, PageContent } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import { SectionWrap } from 'shared_components/layout/Page';
import UserBasicInfo from 'styled_scenes/Account/components/UserBasicInfo';
import TripSectionComponent from 'styled_scenes/Account/Trips/shared/TripSectionComponent';

class AccountTripsScene extends Component {
  static propTypes = {
    allTrips: PropTypes.array,
    isLoadingTrips: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    allTrips: [],
  };

  getTrips = pathname => {
    const { allTrips } = this.props;
    let status = 'all';
    if (pathname === '/account/trips/planned' || pathname === '/account/trips/completed') {
      history.replace('/account/trips/all');
    }
    return allTrips.filter(trip => {
      if (status === 'all') return true;
      const tripStatus = trip && trip.metaData && trip.metaData.status;
      return tripStatus === status;
    });
  };

  render() {
    const { location, isLoadingTrips } = this.props;
    const { pathname } = location;
    return (
      <div>
        <Page topPush>
          <TopBar fixed />
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
                  isLoadingTrips={isLoadingTrips}
                  trips={this.getTrips(pathname)}
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
