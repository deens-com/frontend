import React from 'react';
import TripOrganizerContainer from './containers/TripOrganizer';

const TripOrganizer = props => {
  return (
    <div className="TripOrganizer">
      <TripOrganizerContainer {...props} />
    </div>
  );
};

export default TripOrganizer;
