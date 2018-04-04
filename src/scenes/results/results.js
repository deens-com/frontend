import React from "react";
import ResultsContainer from "./containers/results_container";
import history from "./../../main/history";

const Results = props => {
  let service_type = "";
  if (props.location.search.includes("?type=")) {
    service_type = props.location.search.replace("?type=", "");
  }

  let tags = [];
  if (props.location.search.includes("?tags=")) {
    tags = [props.location.search.replace("?tags=", "")];
  }

  return (
    <div className="Home">
      <ResultsContainer {...props} service_type={service_type} tags={tags} />
    </div>
  );
};

export default Results;
