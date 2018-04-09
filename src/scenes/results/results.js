import React from "react";
import ResultsContainer from "./containers/results_container";
import history from "./../../main/history";
import queryString from "query-string";

const Results = props => {
  let search_params = queryString.parse(props.location.search);
  let service_types =
    (search_params.service_types && search_params.service_types.split("-")) ||
    [];
  let tags_arr = (search_params.tags && search_params.tags.split("-")) || [];

  return (
    <div className="Home">
      <ResultsContainer
        {...props}
        service_types={service_types}
        tags={tags_arr}
      />
    </div>
  );
};

export default Results;
