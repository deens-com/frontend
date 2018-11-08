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
    props.fetchTrip(props.match.params.id);

    if (props.startDate && props.numberOfPeople) {
      props.checkAvailability(props.match.params.id, props.startDate, props.numberOfPeople);
    }
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
      checkAvailability,
      availability,
      isCloning,
      cloneTrip,
      session,
      isGDPRDismissed,
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
        checkAvailability={checkAvailability}
        availability={availability.data}
        isCheckingAvailability={availability.isChecking}
        isCloning={isCloning}
        cloneTrip={cloneTrip}
        currentUserId={session._id}
        history={this.props.history}
        action={
          this.props.location && this.props.location.state && this.props.location.state.action
        }
        isGDPRDismissed={isGDPRDismissed}
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
    numberOfPeople: state.ResultsReducer.search_query.person_nb || 1,
    startDate: state.ResultsReducer.search_query.start_date,
    endDate: state.ResultsReducer.search_query.end_date,
    availability: state.TripReducer.availability,
    isCloning: state.TripReducer.isCloning,
    isGDPRDismissed: state.SettingsReducer.gdprDismissed,
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
