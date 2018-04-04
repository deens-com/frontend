import React from "react";
import ResultsContainer from "./containers/results_container";
import history from "./../../main/history";

const Results = props => {
  let service_type = "";
  if (props.location.search.includes("?type=")) {
    service_type = props.location.search.replace("?type=", "");
  }

  let tags_arr = [];
  if (props.location.search.includes("?tags=")) {
    let tags = props.location.search.replace("?tags=", "");
    if (!tags.includes(",")) {
      tags_arr = [tags];
    } else {
      tags_arr = tags.split(",");
    }
  }

  return (
    <div className="Home">
      <ResultsContainer
        {...props}
        service_type={service_type}
        tags={tags_arr}
      />
    </div>
  );
};

export default Results;
