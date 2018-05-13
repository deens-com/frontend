import React, { Component } from "react";
import ServiceComponent from "./../components/service_component";
import * as services_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ServicesContainer extends Component {
  componentDidMount() {
    const service_id = this.props.match.params.id;
    this.props.fetch_service(service_id);
    this.props.fetchMyTrips();
  }

  render() {
    return <ServiceComponent {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    service: state.ServicesReducer.service,
    trips: state.ServicesReducer.trips,
    reviews: state.ServicesReducer.reviews,
    myTrips: state.ServicesReducer.userTrips.data,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ServicesContainer);
