import React from 'react';
import TripOrganizerContainer from './containers/TripOrganizer';

const TripOrganizer = props => {
  return (
    <div className="TripOrganizer">
      <TripOrganizerContainer key={props.match.params.id} {...props} />
    </div>
  );
};

export default TripOrganizer;
