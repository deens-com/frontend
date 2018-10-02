import React from 'react';
import TripOrganizerContainer from './containers/TripCreator';

const TripCreator = props => {
  return (
    <div className="TripCreator">
      <TripOrganizerContainer {...props} />
    </div>
  );
};

export default TripCreator;
