import React from 'react';
import ResultsContainer from './containers/results_container';
//import history from 'main/history'
import Helmet from 'react-helmet-async';
import { websiteUrl } from 'libs/config';
import { mapUrlToProps } from 'libs/search';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.routeState = props.location.state;
  }
  componentDidMount() {
    //this.unlisten = this.props.history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    //this.unlisten();
  }

  render() {
    const searchParams = mapUrlToProps(this.props.location);

    let helmet;

    const location = searchParams.address ? `near ${searchParams.address}` : '';
    const serviceTypesStr = searchParams.type.join(', ');
    const title = `Find ${serviceTypesStr || 'services'} ${location}`;
    const url = `${websiteUrl}${this.props.location.pathname}${this.props.location.search}`;

    helmet = (
      <Helmet>
        <title>{title} | Deens.com</title>
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
          searchParams={searchParams}
          routeState={this.routeState}
          rawSearchQuery={this.props.location.search}
        />
      </div>
    );
  }
}

export default Results;
