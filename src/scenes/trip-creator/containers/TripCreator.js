import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { update_search_query_without_search } from '../../../scenes/results/actions';
import moment from 'moment';
import TripOrganizer from '../../../styled_scenes/TripOrganizer';

class TripCreatorContainer extends Component {
  render() {
    return (
      <TripOrganizer
        isCreating
        startDate={moment(this.props.startDate)}
        numberOfPeople={this.props.numberOfPeople}
        changeDates={this.props.changeDates}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    numberOfPeople: state.ResultsReducer.search_query.person_nb || 1,
    startDate: state.ResultsReducer.search_query.start_date || moment().add(1, 'days'),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeDates: update_search_query_without_search,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripCreatorContainer));
