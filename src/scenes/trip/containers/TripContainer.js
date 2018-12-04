import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import TripComponent from 'styled_scenes/Trip';
import NotFound from 'styled_scenes/NotFound';
import * as actions from '../actions';
import { update_search_query_without_search } from '../../../scenes/results/actions';
import { getPriceFromServiceOption, getPeopleCount } from 'libs/Utils';

function getBookedInformation(trip) {
  const serviceOptions = trip.otherAttributes.selectedServiceOptions;
  if (!serviceOptions) {
    return {};
  }
  return serviceOptions.reduce((prev, option) => {
    const serviceFound = trip.services.find(
      service => service.service._id === option.serviceId && service.day === option.day,
    );

    if (!serviceFound) {
      return prev;
    }

    const price = getPriceFromServiceOption(
      serviceFound.basePrice,
      option.price,
      getPeopleCount(trip),
    );

    if (!prev[option.day]) {
      return {
        ...prev,
        [option.day]: {
          [option.serviceId]: {
            price,
          },
        },
      };
    }
    return {
      ...prev,
      [option.day]: {
        ...prev[option.day],
        [option.serviceId]: {
          price,
        },
      },
    };
  }, {});
}

class TripContainer extends Component {
  constructor(props) {
    super(props);
    props.fetchTrip(props.match.params.id);

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
    } = this.props;

    if (error) {
      return <NotFound />;
    }
    const booked = trip && trip.bookingStatus === 'booked';

    return (
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
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.SessionsReducer.session,
    trip: state.TripReducer.trip,
    error: state.TripReducer.error,
    isLoading: state.TripReducer.isLoading,
    owner: state.TripReducer.owner,
    adults: state.ResultsReducer.search_query.adults || 1,
    children: state.ResultsReducer.search_query.children || 0,
    infants: state.ResultsReducer.search_query.infants || 0,
    startDate: state.ResultsReducer.search_query.start_date,
    endDate: state.ResultsReducer.search_query.end_date,
    availability: state.TripReducer.availability,
    isCloning: state.TripReducer.isCloning,
    isGDPRDismissed: state.SettingsReducer.gdprDismissed,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeDates: update_search_query_without_search,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripContainer));
