import React, { Component } from "react";
import ResultsComponent from "./../components/results_component";
import * as results_actions from "./../actions";
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
      <ResultsComponent {...this.props} service_data={this.props.places} />
    );
  }
}

const mapStateToProps = state => {
  return {
    places: state.ResultsReducer.places
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacesContainer);
