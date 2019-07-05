import React, { Component } from 'react';
import history from 'main/history';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFromCoordinates } from 'libs/Utils';
import axios from 'libs/axios';
import analytics from 'libs/analytics';
import * as sessionActions from 'store/session/actions';
import searchActions from 'store/search/actions';
import ModalOrNot from 'shared_components/ModalOrNot';
import urls from 'libs/urlGenerator';
import LoadingDots from 'shared_components/LoadingDots';

const TripCreatorContent = React.lazy(() =>
  import(/* webpackChunkName: "trip-creator" */ '../components/TripCreator'),
);

class TripCreatorContainer extends Component {
  state = {
    isLoading: false,
  };

  createTrip = location => {
    this.setState({ isLoading: true });
    analytics.trip.create();
    axios
      .post(`/trips`, {
        totalPrice: 0,
        duration: 1,
        media: [],
        services: [],
        title: { en: 'My Trip' },
        userStartLocation: location,
        userEndLocation: location,
        location,
      })
      .then(response => {
        this.props.changeUserTrip(response.data);
        history.replace(urls.trip.organize(response.data._id));
        this.setState({ isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  };

  search = location => {
    let newLocation = location;
    if (location.geo) {
      newLocation = {
        ...newLocation,
        ...getFromCoordinates(location.geo.coordinates),
      };
      delete location.geo;
    }
    this.props.updateSearchParams({
      ...newLocation,
      type: 'trip',
    });
  };

  render() {
    return (
      <ModalOrNot>
        {this.state.isLoading ? (
          <div style={{ display: 'flex' }}>
            <LoadingDots />
          </div>
        ) : (
          <TripCreatorContent
            handleSearch={this.search}
            handleCreateNewTrip={this.createTrip}
            savedSearchQuery={this.props.savedSearchQuery}
            updateSearchParams={this.props.updateSearchParams}
            session={this.props.session}
            routeState={this.props.location.state}
          />
        )}
      </ModalOrNot>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.session.session,
    savedSearchQuery: state.search.searchQuery,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      /*changeDates: actions.patchSearchQuery,
      changeHeader: headerActions.changeHeader,*/
      updateSearchParams: searchActions.updateSearchParams,
      changeUserTrip: sessionActions.changeCurrentUserTrip,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TripCreatorContainer);
