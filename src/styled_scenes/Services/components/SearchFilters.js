// NPM
import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import LocationFormControl from "../../../shared_components/Form/LocationControl";
import FormControl from "../../../shared_components/Form/FormControl";

import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import moment from "moment";
import history from "./../../../main/history";

import * as results_actions from "./../../../scenes/results/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// STYLES
const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

// MODULE
class SearchFilters extends Component {

  constructor(props){
    super(props);
    this.state = {
      address: "",
      latitude: props.latitude || undefined,
      longitude: props.longitude || undefined,
      start_date: props.start_date || "",
      end_date: props.end_date || "",
      person_nb: props.person_nb || undefined,
      service_type: props.service_types || [],
      tags: []
    }
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.refetch_results = this.refetch_results.bind(this);
    this.get_query_params = this.get_query_params.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
  }

  get_query_params(){
    return {
      type: this.state.service_type,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      person_nb: this.state.person_nb,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      tags: this.state.tags
    };
  }

  refetch_results(param_object){
    const query_params = this.get_query_params();
    query_params[Object.keys(param_object)[0]] = param_object[Object.keys(param_object)[0]];
    this.props.update_path(query_params);
  }

  handleStartDateChange(dateObject) {
    const date_start = dateObject.toISOString();
    this.setState({ start_date: date_start });
    this.refetch_results({ start_date: date_start });
  }

  handleEndDateChange(dateObject) {
    const date_end = dateObject.toISOString();
    this.setState({ end_date: date_end });
    this.refetch_results({ end_date: date_end });
  }

  handleLocationChange(address) {
    geocodeByAddress(address)
      .then(results => {
        this.setState({ address });
        return getLatLng(results[0]);
      })
      .then(results => {
        const { lat, lng } = results;
        this.setState({ latitude: lat, longitude: lng });
      });
  }

  handlePersonChange(person) {
    this.setState({ person_nb: person });
    this.refetch_results({ person_nb: person });
  }

  render(){
    return(
      <Wrap>

        <LocationFormControl onChange={this.handleLocationChange} />

        <FormControl
          type="date"
          onChange={this.handleStartDateChange}
          placeholder="Start date"
          leftIcon="date"
          value={moment(this.state.start_date).format('MMMM Do YYYY')}
        />

        <FormControl
          type="date"
          onChange={this.handleEndDateChange}
          placeholder="End date"
          leftIcon="date"
          value={moment(this.state.end_date).format('MMMM Do YYYY')}
        />

        <FormControl
          type="number"
          onChange={this.handlePersonChange}
          placeholder="Nb"
          leftIcon="person"
          min={1}
          max={10}
          value={this.state.person_nb}
        />

      </Wrap>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilters);
