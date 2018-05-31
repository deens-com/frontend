import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import * as actions from '../../services/actions';
import EditServiceForm from '../components/EditServiceForm';

class EditServiceFormContainer extends Component {
  onSubmit = values => {
    this.props.registerService(values, this.props.history);
  };

  render() {
    return <EditServiceForm onSubmit={this.onSubmit} submitInFlight={this.props.isSubmitting} {...this.props}/>;
  }
}

const mapStateToProps = state => ({
  isSubmitting: state.NewService.isSubmitting,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditServiceFormContainer));
