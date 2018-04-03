import React from "react";
import ResultsContainer from "./containers/results_container";
import history from "./../../main/history";

const Results = props => {
  let service_type = props.location.search.replace("?type=", "");
  return (
    <div className="Home">
      <ResultsContainer {...props} service_type={service_type} />
    </div>
  );
};

export default Results;
