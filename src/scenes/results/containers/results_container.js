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
    this.props.updateSearchParams(params, null, null, true);
  }

  retryFetch = () => {
    this.props.fetchResults(this.props.searchParams);
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
