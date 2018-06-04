import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import * as actions from '../actions';
import ServiceForm from '../../../shared_components/ServiceForm';

class EditServiceFormContainer extends Component {
  componentDidMount() {
    this.props.fetchService(this.props.match.params.id);
  }

  onSubmit = values => {
    console.log('on submit', values);
  };

  render() {
    // TODO: show a 404 if edit service id is not found
    return (
      <ServiceForm
        onSubmit={this.onSubmit}
        submitInFlight={this.props.isLoading}
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
