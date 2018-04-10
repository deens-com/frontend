import React from "react";
import ResultsContainer from "./containers/results_container";
import history from "./../../main/history";
import queryString from "query-string";

const Results = props => {
  let search_params = queryString.parse(props.location.search);
  let service_types =
    (search_params.service_types && search_params.service_types.split(" ")) ||
    [];
  let tags_arr = (search_params.tags && search_params.tags.split(" ")) || [];
  let latitude = search_params.latitude || "";
  let longitude = search_params.longitude || "";

  return (
    <div className="Home">
      <ResultsContainer
        {...props}
        service_types={service_types}
        tags={tags_arr}
        latitude={latitude}
        longitude={longitude}
      />
    </div>
  );
};

export default Results;
