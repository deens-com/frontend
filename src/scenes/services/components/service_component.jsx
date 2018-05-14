import React from 'react';
import PropTypes from 'prop-types';

import ServiceScene from './../../../styled_scenes/Service';

const ServiceComponent = props => {
  return <ServiceScene {...props} />;
};

ServiceComponent.propTypes = {
  onAddServiceToTrip: PropTypes.func.isRequired,
  onAddServiceToNewTrip: PropTypes.func.isRequired,
  serviceRecentlyAddedToTripName: PropTypes.string,
};

export default ServiceComponent;
