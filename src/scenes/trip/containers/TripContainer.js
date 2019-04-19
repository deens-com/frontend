import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import TripComponent from 'styled_scenes/Trip';
import NotFound from 'styled_scenes/NotFound';
import actions from 'store/trips/actions';
import searchActions from 'store/search/actions';
import { getPriceFromServiceOption, getPeopleCount } from 'libs/Utils';
import Helmet from 'react-helmet-async';
import { websiteUrl } from 'libs/config';
import I18nText from 'shared_components/I18nText';
import { generateTripSlug } from 'libs/Utils';
import headerActions from 'store/header/actions';

function getBookedInformation(trip) {
  return trip.services.reduce((prev, service) => {
    if (!service.selectedOption) {
      return prev;
    }

    const price = getPriceFromServiceOption(
      service.service.basePrice,
      service.selectedOption.price,
      getPeopleCount(trip),
    );

    if (!prev[service.day]) {
      return {
        ...prev,
        [service.day]: {
          [service.service._id]: {
            price,
          },
        },
      };
    }
    return {
      ...prev,
      [service.day]: {
        ...prev[service.day],
        [service.service._id]: {
          price,
        },
      },
    };
  }, {});
}

class TripContainer extends Component {
  constructor(props) {
    super(props);
    props.changeHeader();
    props.fetchTrip(props.match.params.id, true);

    if (props.startDate && props.adults) {
      props.checkAvailability(props.match.params.id, props.startDate, {
        adults: props.adults,
        infants: props.infants,
        children: props.children,
      });
    }
  }

  render() {
    const {
      error,
      trip,
      isLoading,
      owner,
      adults,
      children,
      infants,
      startDate,
      endDate,
      changeDates,
      checkAvailability,
      availability,
      isCloning,
      cloneTrip,
      session,
      isGDPRDismissed,
      gdprHeight,
    } = this.props;

    if (error) {
      return <NotFound />;
    }

    const isIncorrectUrl =
      this.props.slug &&
      `${this.props.match.params.slug}_${this.props.match.params.id}` !== this.props.slug;
    if (isIncorrectUrl) {
      return <Redirect to={`/trips/${this.props.slug}`} />;
    }
    const booked = trip && trip.bookingStatus === 'booked';

    let helmet;

    if (trip) {
      const title = I18nText.translate(trip.title);
      const url = `${websiteUrl}${this.props.location.pathname}`;
      const description = trip.description && I18nText.translate(trip.description);

      helmet = (
        <Helmet>
          <title>{title} | Deens.com</title>
          {description && <meta name="description" content={description} />}
          {description && <meta property="og:description" content={description} />}
          {this.props.slug && !isIncorrectUrl ? <link rel="canonical" href={url} /> : null}
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
        </Helmet>
      );
    }

    return (
      <React.Fragment>
        {helmet}
        <TripComponent
          isLoading={isLoading}
          trip={trip}
          booked={booked}
          bookedInformation={booked && getBookedInformation(trip)}
          owner={owner}
          startDate={booked ? moment(trip.startDate).valueOf() : startDate}
          endDate={endDate}
          changeDates={changeDates}
          checkAvailability={checkAvailability}
          availability={availability.data}
          isCheckingAvailability={availability.isChecking}
          isCloning={isCloning}
          cloneTrip={cloneTrip}
          currentUserId={session._id}
          history={this.props.history}
          adults={booked ? trip.adultCount : adults}
          children={booked ? trip.childrenCount : children}
          infants={booked ? trip.infantCount : infants}
          action={
            this.props.location && this.props.location.state && this.props.location.state.action
          }
          isGDPRDismissed={isGDPRDismissed}
          gdprHeight={gdprHeight}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const trip = state.trips.trip;

  return {
    session: state.session.session,
    trip,
    error: state.trips.error,
    isLoading: state.trips.isLoading,
    owner: state.trips.owner,
    adults: state.search.searchQuery.adults || 1,
    children: state.search.searchQuery.children || 0,
    infants: state.search.searchQuery.infants || 0,
    startDate: state.search.searchQuery.startDate,
    endDate: state.search.searchQuery.end_date,
    availability: state.trips.availability,
    isCloning: state.trips.isCloning,
    isGDPRDismissed: state.settings.gdprDismissed,
    gdprHeight: state.settings.gdprHeight,
    slug: trip && generateTripSlug(trip),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeDates: searchActions.patchSearchQuery,
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripContainer));
