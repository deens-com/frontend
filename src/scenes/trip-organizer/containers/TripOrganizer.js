import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import actions from 'store/trips/actions';
import styled from 'styled-components';
import searchActions from 'store/search/actions';
import { changeCurrentUserTrip } from 'store/session/actions';
import moment from 'moment';
import TripOrganizer from 'styled_scenes/NewTripOrganizer';
import history from 'main/history';
import { Loader } from 'semantic-ui-react';
import { generateTripSlug } from 'libs/Utils';
import headerActions from 'store/header/actions';
import BrandFooter from 'shared_components/BrandFooter';
import NotFound from 'styled_scenes/NotFound';
import urls from 'libs/urlGenerator';

const Wrapper = styled.div`
  min-height: calc(100vh - 85px);
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
`;

class TripOrganizerContainer extends Component {
  componentDidMount() {
    this.props.changeHeader({ noMargin: true, forceNotFixed: true });
    if (this.props.match.params.id) {
      this.props.fetchTrip(this.props.match.params.id);
      return;
    }
    history.replace('/new/trip', {
      modal: true,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.trip && !prevProps.trip) {
      if (this.props.trip && this.props.trip.bookingStatus === 'booked') {
        history.replace(
          urls.trip.view({
            slug: generateTripSlug(this.props.trip),
            id: this.props.trip._id,
          }),
        );
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

  renderContent() {
    if (!this.props.trip || this.props.isLoading) {
      return <Loader size="massive" active />;
    }

    return (
      <TripOrganizer
        trip={this.props.trip}
        tripId={this.props.match.params.id}
        startDate={moment(this.props.startDate).toJSON()}
        adults={this.props.adults || 2}
        children={this.props.children}
        infants={this.props.infants}
        changeDates={this.props.changeDates}
        updateSearchParams={this.props.updateSearchParams}
        history={this.props.history}
        isGDPRDismissed={this.props.isGDPRDismissed}
        gdprHeight={this.props.gdprHeight}
        isLoading={this.props.isLoading}
        action={
          this.props.location && this.props.location.state && this.props.location.state.action
        }
        changeCurrentUserTrip={this.props.changeCurrentUserTrip}
        session={this.props.session}
      />
    );
  }

  render() {
    if (this.props.error) {
      return <NotFound />;
    }
    return (
      <Wrapper>
        <ContentWrapper>{this.renderContent()}</ContentWrapper>
        <BrandFooter />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, props) => {
  const trip = state.trips.trip;

  let startDate = moment(state.search.searchQuery.startDate || undefined);
  const tomorrow = moment()
    .add(1, 'days')
    .startOf('day');

  if (!startDate || startDate.startOf('day').valueOf() < tomorrow.valueOf()) {
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
    startDate: startDate.toJSON(),
    endDate: state.search.searchQuery.end_date,
    isGDPRDismissed: state.settings.gdprDismissed,
    gdprHeight: state.settings.gdprHeight,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeDates: searchActions.patchSearchQuery,
      changeHeader: headerActions.changeHeader,
      changeCurrentUserTrip: changeCurrentUserTrip,
      updateSearchParams: searchActions.updateSearchParams,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripOrganizerContainer));
