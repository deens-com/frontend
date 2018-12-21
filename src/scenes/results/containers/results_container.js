import React, { Component } from 'react';
import ResultsComponent from './../components/results_component';
import * as results_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetTrip, fetchTrip } from '../../trip/actions';
import { loadTrip } from 'libs/localStorage';
import { Loader } from 'semantic-ui-react';

class ResultsContainer extends Component {
  componentDidMount() {
    let search_query = {
      type: this.props.serviceTypes,
      tags: this.props.tags,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      adults: Number(this.props.adults),
      children: Number(this.props.children),
      infants: Number(this.props.infants),
      start_date: this.props.start_date,
      end_date: this.props.end_date,
      keywords: this.props.keywords,
      speech_query: this.props.speech_query,
      address: this.props.address,
      onlySmartContracts: this.props.onlySmartContracts,
      resultsCount: this.props.resultsCount,
      page: this.props.page,
      limit: this.props.limit,
      sortBy: this.props.sortBy,
      radiusInKm: this.props.radiusInKm,
      text: this.props.text,
    };
    this.props.update_search_query(search_query);
    if (this.hasToLoadTripYet()) {
      this.props.fetchTrip(this.props.routeState.tripId);
    }
  }

  componentWillUpdate(next_props) {
    if (this.did_search_query_changed(this.props, next_props)) {
      this.props.update_search_query({
        type: next_props.serviceTypes,
        tags: next_props.tags,
        latitude: next_props.latitude,
        longitude: next_props.longitude,
        adults: Number(next_props.adults),
        children: Number(next_props.children),
        infants: Number(next_props.infants),
        start_date: next_props.start_date,
        end_date: next_props.end_date,
        keywords: next_props.keywords,
        speech_query: next_props.speech_query,
        address: next_props.address,
        onlySmartContracts: next_props.onlySmartContracts,
        resultsCount: next_props.resultsCount,
        page: next_props.page,
        limit: next_props.limit,
        sortBy: next_props.sortBy,
        radiusInKm: next_props.radiusInKm,
        text: next_props.text,
      });
    }
  }

  did_search_query_changed = (current_props, next_props) => {
    return (
      current_props.serviceTypes !== next_props.serviceTypes ||
      current_props.tags !== next_props.tags ||
      current_props.latitude !== next_props.latitude ||
      current_props.longitude !== next_props.longitude ||
      current_props.adults !== next_props.adults ||
      current_props.children !== next_props.children ||
      current_props.infants !== next_props.infants ||
      current_props.start_date !== next_props.start_date ||
      current_props.end_date !== next_props.end_date ||
      current_props.keywords !== next_props.keywords ||
      current_props.speech_query !== next_props.speech_query ||
      current_props.address !== next_props.address ||
      current_props.resultsCount !== next_props.resultsCount ||
      current_props.page !== next_props.page ||
      current_props.limit !== next_props.limit ||
      current_props.sortBy !== next_props.sortBy ||
      current_props.onlySmartContracts !== next_props.onlySmartContracts ||
      current_props.radiusInKm !== next_props.radiusInKm ||
      current_props.text !== next_props.text
    );
  };

  hasToLoadTripYet = () =>
    this.props.routeState && this.props.routeState.tripId && !this.props.trip;

  render() {
    if (this.hasToLoadTripYet()) {
      return <Loader inline="centered" active />;
    }

    return (
      <ResultsComponent
        {...this.props}
        service_data={this.props.results}
        isLoadingResults={this.props.isLoadingResults || this.hasToLoadTripYet()}
        trip={this.props.trip || loadTrip()}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.ResultsReducer.results,
    search_query: state.ResultsReducer.search_query,
    carousel_tags: state.ResultsReducer.carousel_tags,
    isLoadingResults: state.ResultsReducer.isLoadingResults,
    tagsOptions: state.ResultsReducer.tagsOptions,
    trip: state.TripReducer.trip,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      ...results_actions,
      resetTrip,
      fetchTrip,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsContainer);
