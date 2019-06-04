// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

// COMPONENTS
import Row from '../../../shared_components/layout/Row';
//import TripCard from '../../../shared_components/Cards/Trip';
import TripCard from 'shared_components/Carts/Trip';
import PaginationWrap from 'shared_components/PaginationWrap';
import Button from 'shared_components/Button';
import ReactPaginate from 'react-paginate';
import { media } from '../../../libs/styled';
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
import AddToTrip from 'shared_components/Cards/AddToTrip';

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
    endDay = endDate.diff(tripStartDate, 'days') + 1;
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
        this.props.routeState,
        selectedPage,
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
    const newTripTitle = { 'en-us': `Trip to ${service.location}` };
    const serviceGroup = {
      title: newTripTitle,
      basePrice: service.basePrice,
      baseCurrency: service.baseCurrency,
      services: [{ service: service._id, day: 1 }],
      duration: service.duration,
    };
    const newTrip = (await apiClient.trips.post(serviceGroup)).data;
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
          <h4>Please select a location at the top search bar</h4>
        </section>
      );
    }
    if (!this.props.isLoadingResults && this.props.data.length === 0) {
      return (
        <section>
          {this.props.searchParams.type && this.props.searchParams.type === 'trip' ? (
            <NotFound>
              <img src={notFoundImg} alt="Not found" />
              <h3>There are no trips available in the location selected.</h3>
              <p>
                Be the first to create a trip for {this.props.searchParams.address}, and share to
                earn rewards!
              </p>
              <Button
                type="link"
                href={{
                  pathname: '/trips/create',
                  state: {
                    modal: true,
                  },
                }}
              >
                Create a trip
              </Button>
            </NotFound>
          ) : (
            <h4 style={{ textAlign: 'center', color: 'grey' }}>
              There are no search results for given search criteria.
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
                Loading Results
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
                      item={result}
                      isTrip={!(result.categories && result.categories.length)}
                      isPlaceholder={false}
                      type={this.props.searchParams.type}
                      numberOfGuests={
                        (this.props.searchParams.adults || 2) +
                        (this.props.searchParams.children || 0)
                      }
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
              <strong>{this.state.addedToTrip.service.name}</strong> has been added to day
              {this.state.addedToTrip.days.length > 1 ? 's' : ''}{' '}
              {this.state.addedToTrip.days.join(', ')} of your trip{' '}
              <Link to={`/trips/organize/${this.state.addedToTrip.trip._id}`}>
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
