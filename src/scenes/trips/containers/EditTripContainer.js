import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Parse from 'parse';
import NotFound from '../../../styled_scenes/NotFound';
import EditTripComponent from 'styled_scenes/EditTrip';
import * as trips_actions from './../actions';
import * as selectors from '../selectors';
import { statuses } from '../../../libs/fetch_helpers';

const EditTripContext = React.createContext();

class EditTripContainer extends Component {
  updateTripDetails = (newDetails, showSaved) => {
    if (newDetails.status && newDetails.status !== this.props.trip.status) {
      this.props.setShowTripStatusChanged(true);
    }
    this.props.updateTrip(newDetails, showSaved);
  };

  state = {
    isLoggedIn: false,
  };

  /**
   * For components deep down in the hierarchy make use of this context
   * instead of Prop Drilling
   */
  static ContextConsumer = EditTripContext.Consumer;

  componentDidMount() {
    this.props.resetTripData();
    const trip_id = this.props.match.params.id;
    this.props.fetchTrip(trip_id);
    this.setState({ isLoggedIn: Parse.User.current() != null });
    this.props.setShowTripStatusChanged(false);
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

  onBookClick = (startDate, peopleCount) => {
    if (this.state.isLoggedIn) {
      this.props.cloneTrip(startDate, peopleCount, this.props.history);
    } else {
      this.props.history.push('/login');
    }
  };

  onShareModalClose = () => {
    this.props.setShowTripStatusChanged(false);
  };

  render() {
    const { tripError, trip } = this.props;
    if (tripError && tripError.code === Parse.Error.OBJECT_NOT_FOUND) {
      return <NotFound />;
    }
    const currentUser = Parse.User.current();
    if (
      trip.objectId &&
      (trip && trip.owner && trip.owner.objectId) !== (currentUser && currentUser.id)
    ) {
      return <NotFound />;
    }
    return (
      // If there's a way to avoid creating the value object every time we render
      // Please do let me know
      // - jaydp
      <EditTripContext.Provider
        value={{
          ...this.state,
          ...this.props,
          updateTripDetails: this.updateTripDetails,
          onShareModalClose: this.onShareModalClose,
        }}
      >
        <EditTripComponent
          {...this.props}
          onServiceDragEnd={this.onDragReOrderChange}
          onServiceRemoveClick={this.onServiceRemoveClick}
          onBookClick={this.onBookClick}
        />
      </EditTripContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    trip: state.TripsReducer.trip,
    tripError: state.TripsReducer.tripError,
    scheduledServices: selectors.getScheduledServices(state),
    isCloningInProcess: state.TripsReducer.cloningStatus === statuses.STARTED,
    query: state.TripsReducer.query,
    serviceAvailabilityCheckInProgress:
      state.TripsReducer.serviceAvailabilityCheckStatus === statuses.STARTED,
    showTripStatusChanged: state.TripsReducer.showTripStatusChanged,
    isImageUploadInProgress: state.TripsReducer.isImageUploadInProgress,
    isPageLoading: state.TripsReducer.isPageLoading,
    notes: state.TripsReducer.notes,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(trips_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(EditTripContainer));
