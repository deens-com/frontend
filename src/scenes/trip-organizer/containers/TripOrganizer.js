import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../trip/actions';

class TripOrganizer extends Component {
  render() {
    return <div>Trip organizer</div>;
  }
}

const mapStateToProps = state => {
  return {
    session: state.SessionsReducer.session,
    trip: state.TripReducer.trip,
    error: state.TripReducer.error,
    isLoading: state.TripReducer.isLoading,
    owner: state.TripReducer.owner,
    numberOfPeople: state.ResultsReducer.search_query.person_nb || 1,
    startDate: state.ResultsReducer.search_query.start_date,
    endDate: state.ResultsReducer.search_query.end_date,
    availability: state.TripReducer.availability,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripOrganizer));
