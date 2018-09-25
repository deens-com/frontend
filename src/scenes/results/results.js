import React from 'react';
import ResultsContainer from './containers/results_container';
import queryString from 'query-string';

const Results = props => {
  let search_params = queryString.parse(props.location.search);
  // does not properly parse '+'.
  let service_types = (search_params.service_types && search_params.service_types.split(' ')) || [
    'trip',
  ];
  let tags_arr = (search_params.tags && search_params.tags.split(' ')) || [];
  let latitude = search_params.latitude || '';
  let longitude = search_params.longitude || '';
  let person_nb = search_params.person_nb || '';
  let start_date = search_params.start_date || '';
  let end_date = search_params.end_date || '';
  let keywords = search_params.keywords || '';
  let speech_query = search_params.speech_query || '';
  let address = search_params.address || '';
  let onlySmartContracts = search_params.onlySmartContracts || false;
  let page = search_params.page || 1;
  let resultsCount = search_params.resultsCount || 0;
  let limit = search_params.limit || 10;

  return (
    <div className="Home">
      <ResultsContainer
        {...props}
        service_types={service_types}
        tags={tags_arr}
        latitude={latitude}
        longitude={longitude}
        person_nb={person_nb}
        start_date={start_date}
        end_date={end_date}
        keywords={keywords}
        speech_query={speech_query}
        address={address}
        onlySmartContracts={onlySmartContracts}
        page={page}
        resultsCount={resultsCount}
        limit={limit}
      />
    </div>
  );
};

export default Results;
