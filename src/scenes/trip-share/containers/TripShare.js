import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../trip/actions';
import TripShare from '../../../styled_scenes/TripShare';

class TripShareContainer extends Component {
  constructor(props) {
    super(props);
    props.fetchTrip(props.match.params.id);
  }

  render() {
    return (
      <TripShare
        trip={this.props.trip}
        tripId={this.props.match.params.id}
        session={this.props.session}
        isLoading={this.props.isLoading}
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
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripShareContainer));
