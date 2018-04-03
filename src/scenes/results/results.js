import React from "react";
import ResultsContainer from "./containers/results_container";
import history from "./../../main/history";

const Results = props => {
  return (
    <div className="Home">
      <ResultsContainer {...props} />
    </div>
  );
};

export default Results;
