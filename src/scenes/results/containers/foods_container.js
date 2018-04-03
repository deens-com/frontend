import React, { Component } from "react";
// import FoodsComponent from "./../components/foods_component";
import ResultsComponent from "./../components/results_component";
import { foodList } from "./../../../data/food";
import * as results_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class FoodsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_foods();
  }

  render() {
    return <ResultsComponent {...this.props} service_data={this.props.foods} />;
  }
}

const mapStateToProps = state => {
  return {
    foods: state.ResultsReducer.foods
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodsContainer);
