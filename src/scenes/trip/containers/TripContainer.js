import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import TripComponent from 'styled_scenes/Trip';
import NotFound from 'styled_scenes/NotFound';
import * as actions from '../actions';
import { update_search_query_without_search } from '../../../scenes/results/actions';

class TripContainer extends Component {
  constructor(props) {
    super(props);
    props.fetchTrip(this.props.match.params.id);
  }

  render() {
    const {
      error,
      trip,
      isLoading,
      owner,
      numberOfPeople,
      startDate,
      endDate,
      changeDates,
    } = this.props;

    if (error) {
      return <NotFound />;
    }

    return (
      <TripComponent
        isLoading={isLoading}
        trip={trip}
        owner={owner}
        numberOfPeople={numberOfPeople}
        startDate={startDate}
        endDate={endDate}
        changeDates={changeDates}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.SessionsReducer.session,
    trip: state.TripReducer.trip,
    error: state.TripReducer.error,
    isLoading: state.TripReducer.isLoading,
    owner: state.TripReducer.owner,
    numberOfPeople: state.ResultsReducer.search_query.person_nb,
    startDate: state.ResultsReducer.search_query.start_date,
    endDate: state.ResultsReducer.search_query.end_date,
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
)(withRouter(TripContainer));
