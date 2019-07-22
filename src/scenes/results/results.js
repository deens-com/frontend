import React from 'react';
import ResultsContainer from './containers/results_container';
//import history from 'main/history'
import { Helmet } from 'react-helmet-async';
import { websiteUrl } from 'libs/config';
import { mapUrlToProps } from 'libs/search';

class Results extends React.Component {
  render() {
    const searchParams = mapUrlToProps(this.props.location);

    let helmet;

    const location = searchParams.address ? `near ${searchParams.address}` : '';
    const serviceTypesStr = searchParams.type;
    const title = `Find ${serviceTypesStr || 'services'} ${location}`;
    const url = `${websiteUrl}${this.props.location.pathname}${this.props.location.search}`;

    helmet = (
      <Helmet>
        <title>{title} | Deens</title>
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
      </Helmet>
    );

    return (
      <div className="Home">
        {helmet}
        <ResultsContainer
          {...this.props}
          routeState={this.props.location.state}
          rawSearchQuery={this.props.location.search}
          urlSearchParams={searchParams}
        />
      </div>
    );
  }
}

export default Results;
