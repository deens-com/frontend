import React, { Component } from 'react';
import ServiceComponent from '../components/Service';
import serviceActions from 'store/services/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Redirect } from 'react-router';
import NotFoundScene from 'styled_scenes/NotFound';
import Helmet from 'react-helmet-async';
import { websiteUrl } from 'libs/config';
import I18nText from 'shared_components/I18nText';
import { generateServiceSlug } from 'libs/Utils';
import { getHeroImageUrlFromMedia } from 'libs/media';
import tripActions from 'store/trips/actions';
import headerActions from 'store/header/actions';
import { getServiceJsonLdData } from 'libs/json-ld';

class ServicesContainer extends Component {
  state = {
    recentlyAddedToTrip: undefined,
  };

  componentDidMount() {
    this.props.changeHeader();
    const service_id = this.props.match.params.id;
    this.props.fetch_service(service_id);
    this.props.fetchMyTrips();
    this.props.setAddedToTripMessage(undefined);
  }

  componentWillUnmount() {
    this.props.resetServiceData();
  }

  onAddServiceToTrip = ({ trip, day }) => {
    this.props.addServiceToTrip({ trip, day });
  };

  onAddServiceToNewTrip = () => {
    this.props.createNewTrip();
  };

  render() {
    if (this.props.serviceFetchError.code === 404) {
      return <NotFoundScene />;
    } else {
      let helmet;
      const { service } = this.props;
      if (service._id) {
        const locationObject = service.originalLocation || service.location;
        const location = locationObject ? locationObject.city || locationObject.state : '';
        const metaDescription = service.description
          ? I18nText.translate(service.description)
          : `${I18nText.translate(service.categories[0].names)}${
              location ? ` in ${location}` : ''
            }`;
        const description = `${metaDescription.substring(
          0,
          Math.min(155, metaDescription.length),
        )}...`;
        const image = getHeroImageUrlFromMedia(service.media);
        const url = `${websiteUrl}${this.props.location.pathname}`;
        const title = `${I18nText.translate(service.title)}${location ? `, ${location}` : ''}`;
        const isIncorrectUrl =
          this.props.slug &&
          `${this.props.match.params.slug}_${this.props.match.params.id}` !== this.props.slug;

        helmet = (
          <Helmet>
            {this.props.slug && !isIncorrectUrl ? <link rel="canonical" href={url} /> : null}
            <title>{title} | Deens.com</title>
            <meta name="description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            {image && <meta property="og:image" content={image} />}
            <script type="application/ld+json">
              {JSON.stringify(getServiceJsonLdData(service, url))}
            </script>
          </Helmet>
        );

        if (isIncorrectUrl) {
          return <Redirect to={`/services/${this.props.slug}`} />;
        }
      }

      return (
        <React.Fragment>
          {helmet}
          <ServiceComponent
            {...this.props}
            onAddServiceToTrip={this.onAddServiceToTrip}
            onAddServiceToNewTrip={this.onAddServiceToNewTrip}
          />
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  const service = state.services.service;
  const isLoggedIn = state.session.loggedIn;

  return {
    service,
    isLoggedIn,
    trips: state.services.trips.filter(trip => trip !== undefined),
    reviews: state.services.reviews,
    myUnpurchasedTrips: state.trips.userTrips.unbookedTrips,
    serviceRecentlyAddedToTrip: state.services.serviceRecentlyAddedToTrip,
    serviceAlreadyAddedToTrip: state.services.serviceAlreadyAddedToTrip,
    isServiceUnavailableModalOpen: state.services.isServiceUnavailableModalOpen,
    abi: state.services.abi,
    isPageLoading: state.services.isPageLoading,
    isLoading: state.services.isUpdatingTrip || state.services.isCreatingTrip,
    serviceFetchError: state.services.serviceFetchError,
    slug: service._id && generateServiceSlug(service),
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      ...serviceActions,
      fetchMyTrips: tripActions.fetchUserTrips,
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ServicesContainer));
