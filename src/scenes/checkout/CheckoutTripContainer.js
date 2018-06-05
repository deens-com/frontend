import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Results from '../../styled_scenes/Trips/components/Results';

export default class CheckoutTripContainer extends Component {
  componentDidMount() {}

  render() {
    return (
      <h3>Checkout Trip Container</h3>
      // <Results
      //   trip={this.props.trip}
      //   showDetails={this.state.details}
      //   scheduledServices={this.props.scheduledServices}
      //   unScheduledServices={this.props.unScheduledServices}
      //   onServiceDragEnd={this.props.onServiceDragEnd}
      //   onServiceRemoveClick={this.props.onServiceRemoveClick}
      // />
    );
  }
}
