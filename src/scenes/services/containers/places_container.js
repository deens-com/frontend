import React, { Component } from "react";
import ServicesComponent from "./../components/services_component";
import * as services_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class PlacesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_places();
  }

  render() {
    return (
      <ServicesComponent {...this.props} service_data={this.props.places} />
    );
  }
}

const mapStateToProps = state => {
  return {
    places: state.ServicesReducer.places
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacesContainer);
