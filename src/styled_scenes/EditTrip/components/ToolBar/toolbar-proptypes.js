import PropTypes from 'prop-types';

export default {
  trip: PropTypes.object.isRequired,
  onCheckAvailabilityClick: PropTypes.func.isRequired,
  serviceAvailabilityCheckInProgress: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
};
