import React, { Component } from "react";
// import FoodsComponent from "./../components/foods_component";
import ResultsComponent from "./../components/results_component";
import { foodList } from "./../../../data/food";
import * as results_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class TripsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_trips();
  }

  render() {
    return <ResultsComponent {...this.props} service_data={this.props.trips} />;
  }
}

const mapStateToProps = state => {
  return {
    trips: state.ResultsReducer.trips
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TripsContainer);
