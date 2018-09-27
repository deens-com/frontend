import React from 'react';
import TripContainer from './containers/TripContainer';

const Trip = props => {
  return (
    <div className="Trip">
      <TripContainer {...props} />
    </div>
  );
};

export default Trip;
