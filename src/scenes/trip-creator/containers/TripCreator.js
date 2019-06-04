import React, { Component, Suspense } from 'react';
import history from 'main/history';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'shared_components/Modal';
import { getFromCoordinates } from 'libs/Utils';
import axios from 'libs/axios';
import analytics from 'libs/analytics';
import * as sessionActions from 'store/session/actions';
import searchActions from 'store/search/actions';
import LoadingDots from 'shared_components/LoadingDots';
import BrandFooter from 'shared_components/BrandFooter';

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
        title: { 'en-us': 'My Trip' },
        userStartLocation: location,
      })
      .then(response => {
        this.props.changeUserTrip(response.data);
        history.replace(`/trips/organize/${response.data._id}`);
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
    const tripCreator = (
      <Suspense fallback={<LoadingDots />}>
        <TripCreatorContent
          handleSearch={this.search}
          handleCreateNewTrip={this.createTrip}
          savedSearchQuery={this.props.savedSearchQuery}
        />
      </Suspense>
    );

    if (this.props.location.state && this.props.location.state.modal) {
      return (
        <Modal open onCloseRequest={() => history.goBack()}>
          {this.state.isLoading ? (
            <span style={{ display: 'flex' }}>
              <LoadingDots />
            </span>
          ) : (
            tripCreator
          )}
        </Modal>
      );
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 85px)',
        }}
      >
        {tripCreator}
        <BrandFooter />
      </div>
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
      changeUserTrip: sessionActions.changeCurrentUserTrip,
      updateSearchParams: searchActions.updateSearchParams,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripCreatorContainer));
