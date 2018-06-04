import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import * as actions from '../actions';
import ServiceForm from '../../../shared_components/ServiceForm';

class EditServiceFormContainer extends Component {
  getServiceId = () => this.props.match.params.id;

  componentDidMount() {
    this.props.fetchService(this.getServiceId());
  }

  onSubmit = values => {
    console.log('on submit', values);
    this.props.saveServiceChanges(this.getServiceId(), values, this.props.history);
  };

  render() {
    // TODO: show a 404 if edit service id is not found
    return (
      <ServiceForm
        onSubmit={this.onSubmit}
        submitInFlight={this.props.isLoading}
        submitButtonText="Save"
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.EditService.isLoading,
  service: state.EditService.service,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditServiceFormContainer));
