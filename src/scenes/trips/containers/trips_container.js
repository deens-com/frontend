import React, { Component } from 'react';
import TripsComponent from './../components/trips_component';
import * as trips_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class TripsContainer extends Component {
  componentDidMount() {
    const trip_id = this.props.match.params.id;
    this.props.fetchTrip(trip_id);
  }

  render() {
    return <TripsComponent {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    trip: state.TripsReducer.trip,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(trips_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TripsContainer);
