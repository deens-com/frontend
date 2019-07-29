import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import actions from 'store/trips/actions';
import tripDesignerActions from 'store/trip-designer/actions';
import searchActions from 'store/search/actions';
import { changeCurrentUserTrip } from 'store/session/actions';
import moment from 'moment';
import TripOrganizer from 'styled_scenes/NewTripOrganizer';
import { Loader } from 'semantic-ui-react';
import headerActions from 'store/header/actions';

class TripOrganizerContainer extends Component {
  renderContent() {
    if (!this.props.trip || this.props.isLoading) {
      return <Loader size="massive" active />;
    }

    return (
      <TripOrganizer
        trip={this.props.trip}
        tripId={this.props.match.params.id}
        startDate={moment(this.props.trip.startDate).toJSON()}
        adults={this.props.trip.adultCount || this.props.adults || 2}
        children={this.props.trip.childrenCount || this.props.children || 0}
        infants={this.props.trip.infantCount || this.props.infants || 0}
        changeDates={this.props.changeDates}
        updateSearchParams={this.props.updateSearchParams}
        history={this.props.history}
        isGDPRDismissed={this.props.isGDPRDismissed}
        gdprHeight={this.props.gdprHeight}
        isLoading={this.props.isLoading}
        action={
          this.props.location && this.props.location.state && this.props.location.state.action
        }
        changeCurrentUserTrip={this.props.changeCurrentUserTrip}
        session={this.props.session}
        // new actions, better if explicit
        checkAvailability={this.props.checkAvailability}
        isCheckingAvailability={this.props.isCheckingAvailability}
        getTransportation={this.props.getTransportation}
        selectTransport={this.props.selectTransport}
        services={this.props.services}
        inDayServices={this.props.inDayServices}
        transports={this.props.transports}
        isLoadingTransportation={this.props.isLoadingTransportation}
        editTrip={this.props.editTrip}
        moveServices={this.props.moveServices}
        availabilities={this.props.availabilities}
        selectedOptions={this.props.selectedOptions}
        selectOption={this.props.selectOption}
        removeServices={this.props.removeServices}
        removeService={this.props.removeService}
        undoRemoveService={this.props.undoRemoveService}
        lastRemovedService={this.props.lastRemovedService}
        removeDay={this.props.removeDay}
        temporalRearrange={this.props.temporalRearrange}
        saveTemporalRearrangement={this.props.saveTemporalRearrangement}
        addCustomService={this.props.addCustomService}
        modifyCustomService={this.props.modifyCustomService}
      />
    );
  }

  render() {
    return this.renderContent();
  }
}

const mapStateToProps = (state, props) => {
  return {
    session: state.session.session,
    trip: state.tripDesigner.trip.data,
    isLoading: state.tripDesigner.trip.isLoading,
    error: state.tripDesigner.trip.error,
    owner: state.trips.owner,
    endDate: state.search.searchQuery.end_date,
    adults: state.search.searchQuery.adults,
    children: state.search.searchQuery.children,
    infants: state.search.searchQuery.infants,
    isGDPRDismissed: state.settings.gdprDismissed,
    gdprHeight: state.settings.gdprHeight,
    services: state.entities.services,
    inDayServices: state.entities.inDayServices,
    selectedOptions: state.entities.selectedOptions,
    transports: state.tripDesigner.transports,
    availabilities: state.tripDesigner.availabilities.data,
    isCheckingAvailability: state.tripDesigner.availabilities.isLoading,
    isLoadingTransportation: state.tripDesigner.isLoadingTransportation,
    lastRemovedService: state.tripDesigner.lastRemovedService,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeDates: searchActions.patchSearchQuery,
      changeHeader: headerActions.changeHeader,
      changeCurrentUserTrip: changeCurrentUserTrip,
      updateSearchParams: searchActions.updateSearchParams,
      checkAvailability: tripDesignerActions.checkAvailability,
      getTransportation: tripDesignerActions.getTransportation,
      selectTransport: tripDesignerActions.selectTransport,
      fetchTrip: tripDesignerActions.fetchTrip,
      editTrip: tripDesignerActions.editTrip,
      moveServices: tripDesignerActions.moveServices,
      selectOption: tripDesignerActions.selectOption,
      removeServices: tripDesignerActions.removeServices,
      removeService: tripDesignerActions.removeService,
      undoRemoveService: tripDesignerActions.undoRemoveService,
      removeDay: tripDesignerActions.removeDay,
      temporalRearrange: tripDesignerActions.temporalRearrange,
      saveTemporalRearrangement: tripDesignerActions.saveTemporalRearrangement,
      addCustomService: tripDesignerActions.addCustomService,
      modifyCustomService: tripDesignerActions.modifyCustomService,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripOrganizerContainer));
