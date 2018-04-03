import React, { Component } from "react";
import ResultsComponent from "./../components/results_component";
import * as results_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ActivitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_activities();
  }

  render() {
    return (
      <ResultsComponent {...this.props} service_data={this.props.activities} />
    );
  }
}

const mapStateToProps = state => {
  return {
    activities: state.ResultsReducer.activities
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ActivitiesContainer
);
