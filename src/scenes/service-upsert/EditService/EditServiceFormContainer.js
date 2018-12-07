import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import Parse from 'parse';
import { Loader } from 'semantic-ui-react';
import history from '../../../main/history';

import * as actions from '../actions';
import ServiceForm from '../../../shared_components/ServiceForm';
import NotFound from '../../../styled_scenes/NotFound';
import { generateServiceSlug } from 'libs/Utils';

class EditServiceFormContainer extends Component {
  getServiceId = () => this.props.match.params.id;

  componentDidMount() {
    this.props.resetErrors();
    this.props.fetchUserProfile();
    this.props.fetchService(this.getServiceId());
    this.props.fetchServiceFormTagsOptions();
  }

  componentWillReceiveProps(nextProps) {
    const { service, userProfile } = nextProps;

    if (
      service &&
      userProfile &&
      service.owner &&
      service.owner.objectId !== userProfile.objectId
    ) {
      history.push('/account/services');
    }
  }

  redeployFailedContract = (values, serviceId) => {
    this.props.redeployContract(values, serviceId, this.props.history);
  };

  onSubmit = values => {
    this.props.saveServiceChanges(this.getServiceId(), values, this.props.history);
  };

  render() {
    const { service, isLoading, fetchError, isSubmitting } = this.props;
    if (fetchError && fetchError.code === Parse.Error.OBJECT_NOT_FOUND) {
      return <NotFound showScene={false} />;
    }
    if (isLoading) {
      return <Loader active inline="centered" size="massive" />;
    }
    return (
      <React.Fragment>
        <h2>
          {' '}
          Editing Service{' '}
          {service && (
            <Link to={`/services/${generateServiceSlug(service)}`}>{service.name}</Link>
          )}{' '}
        </h2>
        <ServiceForm
          onSubmit={this.onSubmit}
          submitInFlight={isSubmitting}
          globalError={this.props.error}
          onRedeployContract={this.redeployFailedContract}
          submitButtonText="Save"
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.ServiceUpsert.isLoading,
  isSubmitting: state.ServiceUpsert.isSubmitting,
  service: state.ServiceUpsert.service,
  error: state.ServiceUpsert.error,
  fetchError: state.ServiceUpsert.error,
  userProfile: state.ServiceUpsert.userProfile,
  serviceFormTagsOptions: state.ServiceUpsert.serviceFormTagsOptions,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(EditServiceFormContainer));
