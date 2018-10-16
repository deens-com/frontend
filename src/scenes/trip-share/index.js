import React from 'react';
import TripShareContainer from './containers/TripShare';

const TripShare = props => {
  return (
    <div className="TripShare">
      <TripShareContainer {...props} />
    </div>
  );
};

export default TripShare;
