import React from 'react';
import ResultsContainer from './containers/results_container';
//import history from 'main/history'
import queryString from 'qs';
import Helmet from 'react-helmet-async';
import { websiteUrl } from 'libs/config';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.routeState = props.location.state;
  }
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
    let adults = search_params.adults || 1;
    let children = search_params.children || 0;
    let infants = search_params.infants || 0;
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
    let city = search_params.city || '';
    let state = search_params.state || '';
    let countryCode = search_params.countryCode || '';
    let text = search_params.text || '';

    let helmet;

    const location = search_params.address ? `near ${search_params.address}` : '';
    const serviceTypesStr = serviceTypes.join(', ');
    const title = `Find ${serviceTypesStr || 'services'} ${location}`;
    const url = `${websiteUrl}${this.props.location.pathname}${this.props.location.search}`;

    helmet = (
      <Helmet>
        <title>{title} | Please.com</title>
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
      </Helmet>
    );

    return (
      <div className="Home">
        {helmet}
        <ResultsContainer
          {...props}
          serviceTypes={serviceTypes}
          tags={tags_arr}
          latitude={latitude}
          longitude={longitude}
          adults={adults}
          children={children}
          infants={infants}
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
          city={city}
          state={state}
          countryCode={countryCode}
          radiusInKm={radiusInKm}
          text={text}
          routeState={this.routeState}
        />
      </div>
    );
  }
}

export default Results;
