import React, { Component } from 'react';
import ServiceComponent from './../components/service_component';
import * as services_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Parse from 'parse';

class ServicesContainer extends Component {
  state = {
    recentlyAddedToTrip: undefined,
  };

  componentDidMount() {
    const service_id = this.props.match.params.id;
    this.props.fetch_service(service_id);
    if (Parse.User.current() != null) {
      this.props.fetchMyTrips();
    }
  }

  onAddServiceToTrip = trip => {
    if (Parse.User.current() != null) {
      this.props.addServiceToTrip(trip);
    } else {
      this.props.history.push('/login');
    }
  };

  onAddServiceToNewTrip = () => {
    if (Parse.User.current() != null) {
      this.props.createNewTrip();
    } else {
      this.props.history.push('/login');
    }
  };

  render() {
    return (
      <ServiceComponent
        {...this.props}
        onAddServiceToTrip={this.onAddServiceToTrip}
        onAddServiceToNewTrip={this.onAddServiceToNewTrip}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    service: state.ServicesReducer.service,
    trips: state.ServicesReducer.trips,
    reviews: state.ServicesReducer.reviews,
    myTrips: state.ServicesReducer.userTrips.data,
    serviceRecentlyAddedToTripName: state.ServicesReducer.serviceRecentlyAddedToTripName,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ServicesContainer));
