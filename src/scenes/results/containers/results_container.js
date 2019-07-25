import React, { Component } from 'react';
import ResultsComponent from './../components/Results';
import searchActions from 'store/search/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import tripActions from 'store/trips/actions';
import { Loader } from 'semantic-ui-react';
import headerActions from 'store/header/actions';

class ResultsContainer extends Component {
  componentDidMount() {
    this.props.changeHeader();
    const params = this.props.urlSearchParams;
    this.props.updateSearchParams(params, { noChangeUrl: true });
    if (this.props.routeState && this.props.routeState.tripId && !this.props.trip) {
      this.props.fetchTrip(this.props.routeState.tripId);
    }
  }

  retryFetch = () => {
    this.props.updateSearchParams(this.props.urlSearchParams, { noChangeUrl: true });
  };

  hasToLoadTripYet = () =>
    this.props.routeState && this.props.routeState.tripId && !this.props.trip;

  render() {
    if (this.hasToLoadTripYet()) {
      return <Loader inline="centered" active />;
    }

    return (
      <ResultsComponent
        searchParams={this.props.searchParams}
        routeState={this.props.routeState}
        service_data={this.props.results}
        updateSearchParams={this.props.updateSearchParams}
        isLoadingResults={this.props.isLoadingResults || this.hasToLoadTripYet()}
        trip={this.props.trip}
        retryFetch={this.retryFetch}
        count={this.props.count}
        isBehindModal={this.props.isBehindModal}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.search.results.data,
    count: state.search.count,
    isLoadingResults: state.search.results.isLoading,
    tagsOptions: state.search.tagsOptions,
    trip: state.trips.trip,
    searchParams: state.search.searchQuery,
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
