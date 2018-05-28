import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import * as actions from '../actions';
import NewServiceForm from '../components/NewServiceForm';

class NewServiceFormContainer extends Component {
  onSubmit = values => {
    this.props.registerService(values, this.props.history);
  };

  render() {
    return <NewServiceForm onSubmit={this.onSubmit} submitInFlight={this.props.isSubmitting} />;
  }
}

const mapStateToProps = state => ({
  isSubmitting: state.NewService.isSubmitting,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewServiceFormContainer));
