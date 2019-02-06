import React from 'react';
import TripCreatorContainer from './containers/TripCreator';

const TripCreator = props => {
  return (
    <div className="TripCreator">
      <TripCreatorContainer {...props} />
    </div>
  );
};

export default TripCreator;
