import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Parse from 'parse';
import NotFound from '../../../styled_scenes/NotFound';
import TripsComponent from './../components/trips_component';
import * as trips_actions from './../actions';
import * as selectors from '../selectors';
import { statuses } from '../../../libs/fetch_helpers';

class TripsContainer extends Component {
  componentDidMount() {
    const trip_id = this.props.match.params.id;
    this.props.fetchTrip(trip_id);
    this.props.setShowTripUpdated(false);
  }

  /**
   * Called when a service is dragged and dropped
   * could be in the same day
   */
  onDragReOrderChange = event => {
    if (!event) return;
    const { source, destination, draggableId: tripOrganizationId } = event;
    if (!destination || !source || !tripOrganizationId) return;
    const toDay = destination.droppableId;
    this.props.changeServiceDay(tripOrganizationId, toDay);
  };

  onServiceRemoveClick = tripOrganizationId => {
    this.props.removeServiceFromTrip(tripOrganizationId);
  };

  updateTripDetails = (newDetails, showSaved) => {
    this.props.updateTrip(newDetails, showSaved);
  };

  onBookClick = (startDate, peopleCount) => {
    console.log({ startDate, peopleCount });
    this.props.cloneTrip(startDate, peopleCount);
  };

  render() {
    const { tripError } = this.props;
    if (tripError && tripError.code === Parse.Error.OBJECT_NOT_FOUND) {
      return <NotFound />;
    }
    return (
      <TripsComponent
        {...this.props}
        onServiceDragEnd={this.onDragReOrderChange}
        onServiceRemoveClick={this.onServiceRemoveClick}
        updateTripDetails={this.updateTripDetails}
        onBookClick={this.onBookClick}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    trip: state.TripsReducer.trip,
    tripError: state.TripsReducer.tripError,
    scheduledServices: selectors.getScheduledServices(state),
    unScheduledServices: selectors.getUnScheduledServices(state),
    showTripUpdated: state.TripsReducer.showTripUpdated,
    isCloningInProcess: state.TripsReducer.cloningStatus === statuses.STARTED,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(trips_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TripsContainer);
