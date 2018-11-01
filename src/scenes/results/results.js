import React from 'react';
import ResultsContainer from './containers/results_container';
import queryString from 'qs';

class Results extends React.Component {
  componentDidMount() {
    this.unlisten = this.props.history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const props = this.props;
    let search_params = queryString.parse(props.location.search, { ignoreQueryPrefix: true });

    // does not properly parse '+'.
    let serviceTypes = (search_params.serviceTypes && search_params.serviceTypes.split(' ')) || [];
    let tags_arr =
      (props.location.search.match(/(tags.+)/) &&
        props.location.search
          .match(/(tags.+)/)[0]
          .split('&')[0]
          .replace('tags=', '')
          .split('+')) ||
      [];
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
    let sortBy = search_params.sortBy || '';
    let radiusInKm = search_params.radiusInKm || 10;
    let text = search_params.text || '';

    return (
      <div className="Home">
        <ResultsContainer
          {...props}
          serviceTypes={serviceTypes}
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
          sortBy={sortBy}
          radiusInKm={radiusInKm}
          text={text}
        />
      </div>
    );
  }
}

export default Results;
