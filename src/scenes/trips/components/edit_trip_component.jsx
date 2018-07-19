import React from 'react';
import PropTypes from 'prop-types';
import EditTripScene from './../../../styled_scenes/EditTrip';

const EditTripComponent = props => {
  return <EditTripScene {...props} />;
};

EditTripComponent.propTypes = {
  trip: PropTypes.object,
  scheduledServices: PropTypes.array,
  unScheduledServices: PropTypes.array,
  onServiceDragEnd: PropTypes.func.isRequired,
  onServiceRemoveClick: PropTypes.func.isRequired,
  updateTripDetails: PropTypes.func.isRequired,
  onBookClick: PropTypes.func.isRequired,
  isCloningInProcess: PropTypes.bool.isRequired,
  onShareModalClose: PropTypes.func.isRequired,
};

export default EditTripComponent;
