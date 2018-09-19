import React, { Component } from 'react';
import HomeComponent from './../components/home_component';
import * as home_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GlobalTeaser from 'shared_components/GlobalTeaser';

class HomeContainer extends Component {
  componentDidMount() {
    this.props.fetchTrips();
  }

  render() {
    return (
      <div className="HomeContainer">
        <GlobalTeaser />
        <HomeComponent
          tags={this.props.tags}
          services={this.props.services}
          trips={this.props.trips}
          isLoadingTrips={this.props.isLoadingTrips}
          popularPlaces={this.props.popularPlaces}
          exciting_activities={this.props.exciting_activities}
          delicious_foods={this.props.delicious_foods}
          session={this.props.session}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    services: state.HomeReducer.services,
    tags: state.HomeReducer.tags,
    trips: state.HomeReducer.trips.filter(item => !!item),
    isLoadingTrips: state.HomeReducer.isLoadingTrips,
    popularPlaces: state.HomeReducer.popularPlaces,
    exciting_activities: state.HomeReducer.exciting_activities,
    delicious_foods: state.HomeReducer.delicious_foods,
    session: state.SessionsReducer.session,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(home_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
