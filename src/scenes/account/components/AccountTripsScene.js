import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { Page, PageContent } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBarWithSearch';
import { SectionWrap } from 'shared_components/layout/Page';
import UserBasicInfo from 'styled_scenes/Account/components/UserBasicInfo';
import { scrollDownMobileOnly } from 'styled_scenes/Account/Trips/shared/scrollDownMobileOnly';
import TripSectionComponent from 'styled_scenes/Account/Trips/shared/TripSectionComponent';

const AutoLink = styled(Link)`
  border-bottom: ${props => (props.pathname === props.to ? '2px solid #50a189' : 'none')};
  margin-left: 5px;
  margin-right: 5px;
`;

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
    if (pathname === '/account/trips/planned') {
      status = 'planned';
    } else if (pathname === '/account/trips/completed') {
      status = 'completed';
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
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <Grid centered columns={2}>
              <Grid.Column mobile={16} tablet={5} computer={4}>
                <SectionWrap>
                  <UserBasicInfo />
                </SectionWrap>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={11} computer={12}>
                <h1>My Trips</h1>
                <AutoLink
                  to="/account/trips/all"
                  pathname={pathname}
                  onClick={scrollDownMobileOnly}
                >
                  All
                </AutoLink>
                |
                <AutoLink
                  to="/account/trips/planned"
                  pathname={pathname}
                  onClick={scrollDownMobileOnly}
                >
                  Planned
                </AutoLink>
                |
                <AutoLink
                  to="/account/trips/completed"
                  pathname={pathname}
                  onClick={scrollDownMobileOnly}
                >
                  Completed
                </AutoLink>
                <br />
                <br />
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
