import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import TripComponent from 'styled_scenes/Trip';
import NotFound from 'styled_scenes/NotFound';
import * as actions from '../actions';

class TripContainer extends Component {
  constructor(props) {
    super(props);
    props.fetchTrip(this.props.match.params.id);
  }

  render() {
    const { error, trip, isLoading, owner } = this.props;

    if (error) {
      return <NotFound />;
    }

    return <TripComponent isLoading={isLoading} trip={trip} owner={owner} />;
  }
}

const mapStateToProps = state => {
  return {
    session: state.SessionsReducer.session,
    trip: state.TripReducer.trip,
    error: state.TripReducer.error,
    isLoading: state.TripReducer.isLoading,
    owner: state.TripReducer.owner,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripContainer));
