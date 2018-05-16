import React, { Component } from 'react';
import TripsComponent from './../components/trips_component';
import * as trips_actions from './../actions';
import * as selectors from '../selectors';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class TripsContainer extends Component {
  componentDidMount() {
    const trip_id = this.props.match.params.id;
    this.props.fetchTrip(trip_id);
  }

  /**
   * Called when a service is dragged and dropped
   * could be in the same day
   */
  onDragReOrderChange = event => {
    if (!event) return;
    const { source, destination, draggableId } = event;
    if (!destination || !source || !draggableId) return;
    const fromDay = source.droppableId;
    const toDay = destination.droppableId;
    console.log({ fromDay, toDay, draggableId });
  };

  render() {
    return <TripsComponent {...this.props} onServiceDragEnd={this.onDragReOrderChange} />;
  }
}

const mapStateToProps = state => {
  return {
    trip: state.TripsReducer.trip,
    scheduledServices: selectors.getScheduledServices(state),
    unScheduledServices: selectors.getUnScheduledServices(state),
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(trips_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TripsContainer);
