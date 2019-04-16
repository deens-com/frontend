import React, { Component } from 'react';
import ResultsComponent from './../components/Results';
import searchActions from 'store/search/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import tripActions from 'store/trips/actions';
import { Loader } from 'semantic-ui-react';
import { pushSearch } from 'libs/search';
import headerActions from 'store/header/actions';

class ResultsContainer extends Component {
  componentDidMount() {
    this.props.changeHeader();
    this.props.updateSearchQuery(this.props.searchParams);
    this.props.fetchResults(this.props.searchParams);
    if (this.hasToLoadTripYet()) {
      this.props.fetchTrip(this.props.routeState.tripId);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.rawSearchQuery !== nextProps.rawSearchQuery) {
      this.props.updateSearchQuery(nextProps.searchParams);
      this.props.fetchResults(nextProps.searchParams);
    }
  }

  retryFetch = () => {
    //this.props.updateSearchQuery(searchQuery);
    //this.props.fetchResults(searchQuery);
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
        service_data={this.props.results}
        pushSearch={pushSearch}
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
