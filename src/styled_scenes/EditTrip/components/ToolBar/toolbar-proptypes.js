import PropTypes from 'prop-types';

export default {
  trip: PropTypes.object,
  onCheckAvailabilityClick: PropTypes.func.isRequired,
  serviceAvailabilityCheckInProgress: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
};
