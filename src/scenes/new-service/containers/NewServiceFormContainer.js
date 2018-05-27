import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions';
import NewServiceForm from '../components/NewServiceForm';

class NewServiceFormContainer extends Component {
  onSubmit = values => {
    console.log('from container onSubmit', values);
    this.props.registerService(values);
  };

  render() {
    return <NewServiceForm onSubmit={this.onSubmit} submitInFlight={this.props.isSubmitting} />;
  }
}

const mapStateToProps = state => ({
  isSubmitting: state.NewService.isSubmitting,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewServiceFormContainer);
