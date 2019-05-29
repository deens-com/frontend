import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import history from '../../../main/history';

import * as actions from 'store/services-upsert/actions';
import ServiceForm from '../../../shared_components/ServiceForm';
import NotFound from '../../../styled_scenes/NotFound';
import { generateServiceSlug } from 'libs/Utils';

class EditServiceFormContainer extends Component {
  getServiceId = () => this.props.match.params.id;

  componentDidMount() {
    this.props.resetErrors();
    this.props.fetchService(this.getServiceId());
    this.props.fetchServiceFormTagsOptions();
  }

  componentWillReceiveProps(nextProps) {
    const { service, userProfile } = nextProps;

    if (service && userProfile && service.owner !== userProfile._id) {
      history.push('/account/services');
    }
  }

  onSubmit = values => {
    this.props.saveServiceChanges(this.getServiceId(), values, this.props.history);
  };

  render() {
    const { service, isLoading, fetchError, isSubmitting } = this.props;
    const PARSE_ERROR_OBJECT_NOT_FOUND = 101;
    if (fetchError && fetchError.code === PARSE_ERROR_OBJECT_NOT_FOUND) {
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
          submitButtonText="Save"
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.servicesUpsert.isLoading,
  isSubmitting: state.servicesUpsert.isSubmitting,
  service: state.servicesUpsert.service,
  error: state.servicesUpsert.error,
  fetchError: state.servicesUpsert.error,
  userProfile: state.session.session,
  serviceFormTagsOptions: state.servicesUpsert.serviceFormTagsOptions,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(EditServiceFormContainer));
