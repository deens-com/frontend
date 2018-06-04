import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';

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
    const { service, isLoading } = this.props;
    return (
      <React.Fragment>
        <h2> Editing Service {service && <Link to={`/services/${service.objectId}`}>{service.name}</Link>} </h2>
        <ServiceForm onSubmit={this.onSubmit} submitInFlight={isLoading} submitButtonText="Save" {...this.props} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.EditService.isLoading,
  service: state.EditService.service,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditServiceFormContainer));
