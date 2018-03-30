import React from "react";
import TripsContainer from "./containers/trips_container";
import history from "./../../main/history";

const Trips = props => {
  return (
    <div className="Trips">
      <TripsContainer {...props} />
    </div>
  );
};

export default Trips;
