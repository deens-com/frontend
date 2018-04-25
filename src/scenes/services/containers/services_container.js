import React, { Component } from "react";
import ServiceComponent from "./../components/service_component";
import * as services_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ServicesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const service_id = this.props.location.pathname.replace("/service/", "");
    this.props.fetch_service(service_id);
  }

  render() {
    return <ServiceComponent {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    service: state.ServicesReducer.service,
    trips: state.ServicesReducer.trips,
    reviews: state.ServicesReducer.reviews
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ServicesContainer);
