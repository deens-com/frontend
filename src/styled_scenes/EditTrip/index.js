// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import moment from 'moment';
import { Divider, Message } from 'semantic-ui-react';
// COMPONENTS
import TopBar from 'shared_components/TopBarWithSearch';
import ModifiableDayList from 'styled_scenes/EditTrip/components/ModifiableDayList';
import Summary from 'styled_scenes/EditTrip/components/Summary';

import Button from 'shared_components/Button';

import OwnerToolBar from 'styled_scenes/EditTrip/components/ToolBar/OwnerToolBar';

import expandCardsHoc from 'shared_components/Trip/expandCardsHoc';

// ACTIONS/CONFIG
import { media } from 'libs/styled';

// STYLES
import { Page, PageContent } from '../../shared_components/layout/Page';
import { Hr } from '../../shared_components/styledComponents/misc';
import TripLeftPortion from './components/TripLeftPortion';
import AddNewServiceToTrip from './components/AddNewServiceToTrip';

const Wrap = styled.div`
  ${media.minMediumPlus} {
    display: flex;
  }
`;

const TripWrapper = styled.div`
  width: 100%;

  ${media.minMediumPlus} {
    width: 58%;
  }
`;

const TripActionsWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 25px;
`;

// MODULE
class TripsScene extends Component {
  state = {
    details: true,
    isOwner: false,
  };

  componentDidMount() {
    this.setState({ isOwner: false });
  }

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

  render() {
    const { query, trip, scheduledServices } = this.props;

    return (
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent loading={this.props.isPageLoading}>
          {trip &&
            trip.objectId && (
              <Wrap key={trip.objectId}>
                <TripLeftPortion trip={trip} scheduledServices={scheduledServices} />
                <TripWrapper>
                  {trip.booked ? (
                    <Message>
                      This trip has already been booked on{' '}
                      {moment(query.startDate).format('Do MMM YYYY')}.
                    </Message>
                  ) : null}
                  <OwnerToolBar trip={trip} />
                  <Divider horizontal>Trip itinerary</Divider>
                  <TripActionsWrap>
                    <AddNewServiceToTrip trip={trip} />
                    <Button
                      type="button"
                      round
                      size="small"
                      iconAfter="arrowDown"
                      theme="textGreen"
                      onClick={this.props.toggleExpansionAll}
                      text={
                        Object.keys(this.props.expandedResults).length > 0
                          ? 'Collapse all'
                          : 'Expand all'
                      }
                    />
                  </TripActionsWrap>
                  <ModifiableDayList
                    trip={trip}
                    showDetails={this.state.details}
                    scheduledServices={this.props.scheduledServices}
                    onServiceDragEnd={this.props.onServiceDragEnd}
                    onServiceRemoveClick={this.props.onServiceRemoveClick}
                    expanded={this.props.expandedResults}
                    toggleExpansion={this.props.toggleExpansion}
                  />
                  <Hr />
                  <Summary
                    trip={trip}
                    scheduledServices={this.props.scheduledServices}
                    isOwner
                    onBookClick={this.props.onBookClick}
                    isCloningInProcess={this.props.isCloningInProcess}
                    query={query}
                  />
                </TripWrapper>
              </Wrap>
            )}
        </PageContent>
      </Page>
    );
  }
}

// Props Validation
TripsScene.propTypes = {
  trip: PropTypes.object,
  scheduledServices: PropTypes.array,
  onServiceDragEnd: PropTypes.func.isRequired,
  onServiceRemoveClick: PropTypes.func.isRequired,
  onBookClick: PropTypes.func.isRequired,
  isCloningInProcess: PropTypes.bool.isRequired,
  serviceAvailabilityCheckInProgress: PropTypes.bool.isRequired,
  toggleExpansion: PropTypes.func.isRequired,
  toggleExpansionAll: PropTypes.func.isRequired,
  expandedResults: PropTypes.object.isRequired,
};

export default expandCardsHoc(TripsScene);
