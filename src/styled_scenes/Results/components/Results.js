// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

// COMPONENTS
import Row from '../../../shared_components/layout/Row';
import TripCard from 'shared_components/Carts/Trip';
import PaginationWrap from 'shared_components/PaginationWrap';
import Button from 'shared_components/Button';
import ReactPaginate from 'react-paginate';
import { Loader } from 'semantic-ui-react';
import moment from 'moment';
import { minutesToDays } from 'styled_scenes/Trip/mapServicesToDays';
import notFoundImg from '../not_found.png';
import I18nText from 'shared_components/I18nText';
import { P } from 'libs/commonStyles';
import { valid, primary } from 'libs/colors';
import * as tripUtils from 'libs/trips';
import { hasLocationParams } from 'libs/search';
import apiClient from 'libs/apiClient';
import AddToTrip from 'shared_components/Carts/AddToTrip';
import urls from 'libs/urlGenerator';

// i18n
import { Trans } from '@lingui/macro';

function getDays(type, day, tripDate, duration, start, end) {
  // make unit tests!!!
  if (!start) {
    return [day];
  }

  const numberOfDays = minutesToDays(duration);
  const tripStartDate = moment(tripDate);
  const tripEndDate = moment(tripDate).add(numberOfDays - 1, 'days');
  const startDate = moment(start);
  const endDate = moment(end);

  if (type !== 'accommodation' || !end) {
    if (startDate.isBefore(tripStartDate)) {
      return [1];
    }
    if (startDate.isAfter(tripEndDate)) {
      return [numberOfDays];
    }
    return [startDate.diff(tripStartDate, 'days') + 1];
  }

  let startDay;
  let endDay;
  if (startDate.isSameOrBefore(tripStartDate)) {
    startDay = 1;
  } else if (startDate.isAfter(tripEndDate)) {
    return [numberOfDays];
  } else {
    startDay = startDate.diff(tripStartDate, 'days') + 1;
  }

  if (endDate.isSameOrBefore(tripEndDate)) {
    endDay = endDate.diff(tripStartDate, 'days');
  } else {
    endDay = numberOfDays;
  }

  if (endDay <= startDay) {
    return [startDay];
  }

  return [...Array(endDay - startDay + 1).keys()].map(day => day + startDay);
}

// STYLES
const Wrap = styled.div`
  padding: 25px;
`;

const ResultItem = styled.div`
  position: relative;
`;

const LoaderWithMargin = styled.section`
  margin-top: 40px;
  > div {
    z-index: 1 !important;
  }
`;

const NotFound = styled.div`
  img {
    width: 115px;
  }
  text-align: center;
`;

const AddedToTrip = styled.div`
  position: fixed;
  bottom: 25px;
  background-color: ${valid};
  padding: 13px 21px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-radius: 4px 4px 4px 0;
  a {
    color: ${primary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
`;

// MODULE
class Results extends Component {
  constructor(props) {
    super(props);

    const trip = props.trip;

    if (props.routeState && trip._id === props.routeState.tripId) {
      this.tripServices = props.trip.services.map(service => ({
        ...service,
        service: service.service,
      }));
    }
  }

  state = {
    addedToTrip: null,
  };

  changePage = item => {
    if (item !== undefined) {
      const selectedPage = item.selected + 1;
      this.props.updateSearchParams(
        { ...this.props.searchParams },
        {
          newState: this.props.routeState,
          customPage: selectedPage,
        },
      );
    }
  };

  addToTrip = async service => {
    this.tripServices = tripUtils.addServiceToTrip(this.tripServices, service);
    const day = this.props.routeState.day;
    const tripStartDate = this.props.routeState.startDate;
    const duration = this.props.routeState.duration;
    const startDate = this.props.searchParams.startDate;
    const endDate = this.props.searchParams.endDate;
    const type = this.props.searchParams.type;
    const days = getDays(type, day, tripStartDate, duration, startDate, endDate);

    await tripUtils.addServiceManyDaysRequest(this.props.trip._id, days, service._id);

    this.showAddedToDays(days, service, this.props.trip);
  };

  addToAnyTrip = async (trip, day, service) => {
    await tripUtils.addServiceManyDaysRequest(trip._id, [day], service._id);
    this.showAddedToDays([day], service, trip);
  };

  addToNewTrip = async service => {
    const newTripTitle = { en: `Trip to ${service.location}` };
    const serviceGroup = {
      title: newTripTitle,
      baseCurrency: service.baseCurrency,
      services: [{ service: service._id, day: 1 }],
      duration: service.duration,
      location: service.originalLocation,
      userStartLocation: service.originalLocation,
      userEndLocation: service.originalLocation,
    };
    const newTrip = (await apiClient.trips.post(serviceGroup)).data;
    this.props.getCurrentUserTrip();
    this.showAddedToDays([1], service, newTrip);
  };

  showAddedToDays = (days, service, trip) => {
    const timestamp = new Date().valueOf();

    this.setState({
      addedToTrip: {
        days,
        timestamp,
        service,
        trip,
      },
    });

    setTimeout(() => {
      this.setState(prevState => {
        if (prevState.addedToTrip && prevState.addedToTrip.timestamp === timestamp) {
          return {
            addedToTrip: null,
          };
        }
      });
    }, 5000);
  };

  removeFromTrip = async (serviceId, day) => {
    const serviceToDelete = this.tripServices.find(
      service => service.service._id === serviceId && service.day !== day,
    );

    this.tripServices.filter(service => service._id === serviceToDelete._id);

    await tripUtils.removeServiceRequest(this.props.trip._id, serviceToDelete._id);
    return;
  };

  renderNotFound() {
    if (this.props.searchParams.type !== 'trip' && !hasLocationParams(this.props.searchParams)) {
      return (
        <section>
          <h4>
            <Trans>Please specify a location in the top search bar</Trans>
          </h4>
        </section>
      );
    }
    if (!this.props.isLoadingResults && this.props.data.length === 0) {
      return (
        <section>
          {this.props.searchParams.type && this.props.searchParams.type === 'trip' ? (
            <NotFound>
              <img src={notFoundImg} alt="Not found" />
              <h3>
                <Trans>There are no trips available in the location selected.</Trans>
              </h3>
              <p>
                <Trans>
                  Be the first to create a trip for {this.props.searchParams.address}, and share it
                  to earn rewards!
                </Trans>
              </p>
              <Button
                type="link"
                href={{
                  pathname: '/new/trip',
                  state: {
                    modal: true,
                  },
                }}
              >
                <Trans>Create a trip</Trans>
              </Button>
            </NotFound>
          ) : (
            <h4 style={{ textAlign: 'center', color: 'grey' }}>
              <Trans>Your search didn't return any results, please try to be less specific.</Trans>
            </h4>
          )}
          <br />
        </section>
      );
    }
    return null;
  }

  render() {
    const { onCardOver, onCardLeave } = this.props;

    return (
      <Wrap>
        <Row>
          {this.renderNotFound()}
          {this.props.isLoadingResults ? (
            <LoaderWithMargin>
              <Loader active inline="centered" size="massive">
                <div style={{ lineHeight: '2em' }}>
                  <Trans>
                    Please wait while we search across the top travel websites for the best prices.
                    <br />
                    This may take a few seconds.
                  </Trans>
                </div>
              </Loader>
            </LoaderWithMargin>
          ) : (
            <Grid>
              {this.props.data &&
                this.props.data.map((result, i) => (
                  <ResultItem key={result._id}>
                    {this.props.searchParams.type !== 'trip' && (
                      <AddToTrip
                        data={
                          this.props.routeState && {
                            id: this.props.routeState.tripId,
                            day: this.props.routeState.day,
                            addToTrip: this.addToTrip,
                          }
                        }
                        addToAnyTrip={this.addToAnyTrip}
                        addToNewTrip={this.addToNewTrip}
                        userTrips={this.props.userTrips}
                        service={result}
                      />
                    )}
                    <TripCard
                      onOver={onCardOver}
                      onLeave={onCardLeave}
                      withTooltip
                      withShadow
                      numberOfDays={moment
                        .duration(
                          this.props.searchParams.endDate - this.props.searchParams.startDate,
                        )
                        .asDays()}
                      item={result}
                      isTrip={!(result.categories && result.categories.length)}
                      isPlaceholder={false}
                      type={this.props.searchParams.type}
                      adults={this.props.searchParams.adults || 2}
                      children={this.props.searchParams.children || 0}
                    />
                  </ResultItem>
                ))}
            </Grid>
          )}
        </Row>
        <Row style={{ visibility: this.props.isLoadingResults ? 'hidden' : 'visible' }}>
          <PaginationWrap>
            {this.props.data.length ? (
              <ReactPaginate
                pageCount={Math.ceil(this.props.count / this.props.searchParams.limit)}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={this.changePage}
                previousClassName="previousButton"
                nextClassName="nextButton"
                forcePage={parseInt(this.props.searchParams.page, 10) - 1}
              />
            ) : null}
          </PaginationWrap>
        </Row>
        {this.state.addedToTrip && (
          <AddedToTrip>
            <P>
              <strong>{this.state.addedToTrip.service.name}</strong>
              {this.state.addedToTrip.days.length > 1 ? (
                <Trans>
                  has been added to days {this.state.addedToTrip.days.join(', ')} of your trip
                </Trans>
              ) : (
                <Trans>has been added to day {this.state.addedToTrip.days[0]} of your trip</Trans>
              )}{' '}
              <Link to={urls.trip.organize(this.state.addedToTrip.trip._id)}>
                <I18nText data={this.state.addedToTrip.trip.title} />
              </Link>
            </P>
          </AddedToTrip>
        )}
      </Wrap>
    );
  }
}

export default withRouter(Results);
