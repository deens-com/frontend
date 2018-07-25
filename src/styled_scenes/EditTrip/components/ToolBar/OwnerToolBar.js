import React from 'react';
import PropTypes from 'prop-types';
import EditTripForm from './EditTripForm';
import EditTripContainer from 'scenes/trips/containers/edit_trip_container';

const OwnerToolBar = ({ trip }) => {
  return (
    <EditTripContainer.ContextConsumer>
      {({ updateTripDetails }) => <EditTripForm trip={trip} onSubmit={updateTripDetails} />}
    </EditTripContainer.ContextConsumer>
  );
};

OwnerToolBar.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default OwnerToolBar;
