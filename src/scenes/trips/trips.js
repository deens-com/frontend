import React from "react";
import TripsContainer from "./containers/trips_container";

const Trips = props => {
  return (
    <div className="Trips">
      <TripsContainer {...props} />
    </div>
  );
};

export default Trips;
