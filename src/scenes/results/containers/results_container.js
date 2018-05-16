import React, { Component } from "react";
import ResultsComponent from "./../components/results_component";
import * as results_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ResultsContainer extends Component {
  componentDidMount() {
    let search_query = {
      type: this.props.service_types,
      tags: this.props.tags,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      person_nb: this.props.person_nb,
      start_date: this.props.start_date,
      end_date: this.props.end_date,
      keywords: this.props.keywords,
      speech_query: this.props.speech_query,
      address: this.props.address
    };
    this.props.update_search_query(search_query);
  }

  componentWillUpdate(next_props) {
    if (this.did_search_query_changed(this.props, next_props)) {
      this.props.update_search_query({
        type: next_props.service_types,
        tags: next_props.tags,
        latitude: next_props.latitude,
        longitude: next_props.longitude,
        person_nb: next_props.person_nb,
        start_date: next_props.start_date,
        end_date: next_props.end_date,
        keywords: next_props.keywords,
        speech_query: next_props.speech_query,
        address: next_props.address
      });
    }
  }

  did_search_query_changed = (current_props, next_props) => {
    return (
      current_props.service_types !== next_props.service_types ||
      current_props.tags !== next_props.tags ||
      current_props.latitude !== next_props.latitude ||
      current_props.longitude !== next_props.longitude ||
      current_props.person_nb !== next_props.person_nb ||
      current_props.start_date !== next_props.start_date ||
      current_props.end_date !== next_props.end_date ||
      current_props.keywords !== next_props.keywords ||
      current_props.speech_query !== next_props.speech_query ||
      current_props.address !== next_props.address
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
    search_query: state.ResultsReducer.search_query,
    carousel_tags: state.ResultsReducer.carousel_tags
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsContainer);
