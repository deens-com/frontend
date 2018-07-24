import React from 'react';
import PropTypes from 'prop-types';
import TripsScene from './../../../styled_scenes/Trips';

const TripsComponent = props => {
  return <TripsScene {...props} />;
};

TripsComponent.propTypes = {
  trip: PropTypes.object,
  scheduledServices: PropTypes.array,
  onServiceDragEnd: PropTypes.func.isRequired,
  onServiceRemoveClick: PropTypes.func.isRequired,
  updateTripDetails: PropTypes.func.isRequired,
  onBookClick: PropTypes.func.isRequired,
  isCloningInProcess: PropTypes.bool.isRequired,
  onShareModalClose: PropTypes.func.isRequired,
};

export default TripsComponent;
