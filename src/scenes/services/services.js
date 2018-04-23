import React from "react";
import ServicesContainer from "./containers/services_container";
import history from "./../../main/history";

const Services = props => {
  return (
    <div className="Services">
      <ServicesContainer {...props} />
    </div>
  );
};

export default Services;
