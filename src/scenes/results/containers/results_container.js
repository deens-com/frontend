import React, { Component } from "react";
import ResultsComponent from "./../components/results_component";
import * as results_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ResultsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_results(this.props.service_type);
  }

  componentWillUpdate(nextProps) {
    if (this.props.service_type !== nextProps.service_type) {
      this.props.fetch_results(nextProps.service_type);
    }
  }

  render() {
    return (
      <ResultsComponent {...this.props} service_data={this.props.results} />
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.ResultsReducer.results
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsContainer);
