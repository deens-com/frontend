import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import actions from 'store/trips/actions';
import styled from 'styled-components';
import searchActions from 'store/search/actions';
import { updatePath } from 'store/search/helpers';
import moment from 'moment';
import TripOrganizer from 'styled_scenes/NewTripOrganizer';
import history from 'main/history';
import { Loader } from 'semantic-ui-react';
import { generateTripSlug } from 'libs/Utils';
import headerActions from 'store/header/actions';
import BrandFooter from 'shared_components/BrandFooter';

const Wrapper = styled.div`
  min-height: calc(100vh - 85px);
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
`;

class TripOrganizerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  componentDidMount() {
    this.props.changeHeader({ noMargin: true, forceNotFixed: true });
    if (this.props.match.params.id) {
      this.props.fetchTrip(this.props.match.params.id);
      return;
    }
    history.replace('/trips/create');
  }

  componentDidUpdate(prevProps) {
    if (!this.state.isLoading) {
      if (!prevProps.match.params.id && this.props.match.params.id) {
        this.props.fetchTrip(this.props.match.params.id);
        return;
      }
      if (this.props.trip && !prevProps.trip) {
        if (this.props.trip && this.props.trip.bookingStatus === 'booked') {
          history.replace(`/trips/${generateTripSlug(this.props.trip)}`);
          return;
        }
        if (
          this.props.match.params.id &&
          this.props.trip &&
          this.props.session._id &&
          this.props.trip.owner !== this.props.session._id
        ) {
          history.replace('/');
          return;
        }
      }
    }
  }

  renderContent() {
    if (this.state.isLoading || !this.props.trip) {
      return <Loader size="massive" active />;
    }

    return (
      <TripOrganizer
        trip={this.props.trip}
        tripId={this.props.match.params.id}
        startDate={moment(this.props.startDate).toJSON()}
        adults={this.props.adults || 1}
        children={this.props.children}
        infants={this.props.infants}
        changeDates={this.props.changeDates}
        updatePath={updatePath}
        history={this.props.history}
        isGDPRDismissed={this.props.isGDPRDismissed}
        gdprHeight={this.props.gdprHeight}
        isLoading={this.props.isLoading || this.isLoading}
        action={
          this.props.location && this.props.location.state && this.props.location.state.action
        }
      />
    );
  }

  render() {
    return (
      <Wrapper>
        <ContentWrapper>{this.renderContent()}</ContentWrapper>
        <BrandFooter marginBottom={70} />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, props) => {
  const trip = state.trips.trip;

  let startDate = state.search.searchQuery.start_date;
  if (!startDate) {
    const tomorrow = moment()
      .add(1, 'days')
      .startOf('day');
    if (!trip) {
      startDate = tomorrow;
    } else {
      const tripDate = moment(trip.startDate).startOf('day');
      startDate = tripDate.diff(tomorrow, 'days') >= 0 ? tripDate : tomorrow;
    }
  }

  return {
    session: state.session.session,
    trip,
    error: state.trips.error,
    isLoading: state.trips.isLoading,
    owner: state.trips.owner,
    adults: state.search.searchQuery.adults,
    children: state.search.searchQuery.children,
    infants: state.search.searchQuery.infants,
    startDate,
    endDate: state.search.searchQuery.end_date,
    isGDPRDismissed: state.settings.gdprDismissed,
    gdprHeight: state.settings.gdprHeight,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeDates: searchActions.updateSearchQuery,
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripOrganizerContainer));
