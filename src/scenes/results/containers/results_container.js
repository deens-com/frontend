import React, { Component } from 'react';
import ResultsComponent from './../components/Results';
import searchActions from 'store/search/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import tripActions from 'store/trips/actions';
import { Loader } from 'semantic-ui-react';
import { updatePath } from 'store/search/helpers';
import headerActions from 'store/header/actions';

class ResultsContainer extends Component {
  componentDidMount() {
    this.props.changeHeader();
    let searchQuery = this.createQuery(this.props);

    this.props.updateSearchQuery(searchQuery);
    //this.props.fetchResults(searchQuery);
    if (this.hasToLoadTripYet()) {
      this.props.fetchTrip(this.props.routeState.tripId);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.did_search_query_changed(this.props, nextProps)) {
      const query = this.createQuery(nextProps);

      this.props.updateSearchQuery(query);
      this.props.fetchResults(query);
    }
  }

  createQuery(props) {
    return {
      type: props.serviceTypes,
      tags: props.tags,
      latitude: props.latitude,
      longitude: props.longitude,
      adults: Number(props.adults),
      children: Number(props.children),
      infants: Number(props.infants),
      start_date: Number(props.start_date),
      end_date: Number(props.end_date),
      keywords: props.keywords,
      speech_query: props.speech_query,
      address: props.address,
      onlySmartContracts: props.onlySmartContracts,
      resultsCount: props.resultsCount,
      page: props.page,
      limit: props.limit,
      sortBy: props.sortBy,
      radiusInKm: props.radiusInKm,
      city: props.city,
      state: props.state,
      countryCode: props.countryCode,
      text: props.text,
    };
  }

  retryFetch = () => {
    const searchQuery = this.createQuery(this.props);
    this.props.updateSearchQuery(searchQuery);
    this.props.fetchResults(searchQuery);
  };

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
        updatePath={updatePath}
        isLoadingResults={this.props.isLoadingResults || this.hasToLoadTripYet()}
        trip={this.props.trip}
        retryFetch={this.retryFetch}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.search.results.data,
    search_query: state.search.searchQuery,
    count: state.search.count,
    isLoadingResults: state.search.results.isLoading,
    tagsOptions: state.search.tagsOptions,
    trip: state.trips.trip,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      ...searchActions,
      resetTrip: tripActions.resetTrip,
      fetchTrip: tripActions.fetchTrip,
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsContainer);
