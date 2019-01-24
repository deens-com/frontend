import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import actions from 'store/trips/actions';
import searchActions from 'store/search/actions';
import { updatePath } from 'store/search/helpers';
import moment from 'moment';
import TripOrganizer from '../../../styled_scenes/TripOrganizer';
import history from 'main/history';
import { loadTrip, removeTrip } from 'libs/localStorage';
import axios from 'libs/axios';
import { generateTripSlug } from 'libs/Utils';

class TripOrganizerContainer extends Component {
  constructor(props) {
    super(props);
    if (props.match.params.id) {
      props.fetchTrip(props.match.params.id);
    } else {
      if (this.props.session.username) {
        this.isLoading = true;
        const tripToSave = {
          ...this.props.trip,
          services: this.props.trip.services.map(service => ({
            ...service,
            service: service.service._id,
          })),
        };
        axios.post(`/trips`, tripToSave).then(response => {
          if (props.location.state.action === 'book') {
            history.push(`/trips/checkout/${response.data._id}`);
            removeTrip();
            return;
          } else if (props.location.state.action === 'share') {
            history.push(`/trips/share/${response.data._id}`);
            removeTrip();
            return;
          }
          history.push(`/trips/organize/${response.data._id}`, this.props.location.state);
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.match.params.id && this.props.match.params.id) {
      this.isLoading = false;
      this.props.fetchTrip(this.props.match.params.id);
    }
    if (this.props.trip && this.props.trip.bookingStatus === 'booked') {
      history.replace(`/trips/${generateTripSlug(this.props.trip)}`);
    }
    if (
      this.props.trip &&
      this.props.session._id &&
      this.props.trip.owner !== this.props.session._id
    ) {
      history.replace(`/trips/${generateTripSlug(this.props.trip)}`);
    }
  }

  render() {
    console.log(this.props.isLoading, 'ff', this.isLoading);
    return (
      <TripOrganizer
        trip={this.props.trip}
        tripId={this.props.match.params.id}
        startDate={moment(this.props.startDate)}
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
}

const mapStateToProps = (state, props) => {
  const trip = props.match.params.id ? state.trips.trip : loadTrip();
  console.log('loaded', trip);
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
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripOrganizerContainer));
