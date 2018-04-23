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
    this.props.fetch_service();
  }

  render() {
    return <ServiceComponent {...this.props} services_data={this.props.service} />;
  }
}

const mapStateToProps = state => {
  return {
    service: state.ServicesReducer.service
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ServicesContainer);
