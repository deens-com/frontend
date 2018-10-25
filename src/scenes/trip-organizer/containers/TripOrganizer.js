import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../trip/actions';
import { update_search_query_without_search } from '../../../scenes/results/actions';
import moment from 'moment';
import TripOrganizer from '../../../styled_scenes/TripOrganizer';

class TripOrganizerContainer extends Component {
  constructor(props) {
    super(props);
    props.fetchTrip(props.match.params.id);
  }

  render() {
    return (
      <TripOrganizer
        availability={this.props.availability}
        trip={this.props.trip}
        tripId={this.props.match.params.id}
        startDate={moment(this.props.startDate)}
        numberOfPeople={this.props.numberOfPeople}
        changeDates={this.props.changeDates}
      />
    );
  }
}

const mapStateToProps = state => {
  let startDate = state.ResultsReducer.search_query.start_date;
  if (!startDate) {
    const tomorrow = moment()
      .add(1, 'days')
      .startOf('day');
    if (!state.TripReducer.trip) {
      startDate = tomorrow;
    } else {
      const tripDate = moment(state.TripReducer.trip.startDate).startOf('day');
      startDate = tripDate.diff(tomorrow, 'days') >= 0 ? tripDate : tomorrow;
    }
  }
  return {
    session: state.SessionsReducer.session,
    trip: state.TripReducer.trip,
    error: state.TripReducer.error,
    isLoading: state.TripReducer.isLoading,
    owner: state.TripReducer.owner,
    numberOfPeople: state.ResultsReducer.search_query.person_nb || 1,
    startDate,
    endDate: state.ResultsReducer.search_query.end_date,
    availability: state.TripReducer.availability,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeDates: update_search_query_without_search,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripOrganizerContainer));
