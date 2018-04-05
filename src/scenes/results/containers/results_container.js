import React, { Component } from "react";
import ResultsComponent from "./../components/results_component";
import * as results_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const service_types_list = ["activity", "food", "place", "trip"];

class ResultsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let search_query = {
      type: this.props.service_types,
      tags: this.props.tags
    };
    this.props.update_search_query(search_query);
  }

  componentWillUpdate(nextProps) {
    if (this.did_search_query_changed(this.props, nextProps)) {
      this.props.update_search_query({
        type: nextProps.service_types,
        tags: nextProps.tags
      });
    }
  }

  did_search_query_changed = (current_props, next_props) => {
    return (
      current_props.service_types !== next_props.service_types ||
      current_props.tags !== next_props.tags
    );
  };

  render() {
    return (
      <ResultsComponent {...this.props} service_data={this.props.results} />
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.ResultsReducer.results,
    search_query: state.ResultsReducer.search_query
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsContainer);
