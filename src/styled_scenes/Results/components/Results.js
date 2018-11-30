// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from 'libs/axios';

// COMPONENTS
import Row from '../../../shared_components/layout/Row';
import TripCard from '../../../shared_components/Cards/Trip';
import PaginationWrap from 'shared_components/PaginationWrap';
import Button from 'shared_components/Button';
import ReactPaginate from 'react-paginate';
import { media } from '../../../libs/styled';
import { Loader, Grid } from 'semantic-ui-react';
import moment from 'moment';
import { minutesToDays, getDaysByService } from 'styled_scenes/Trip/mapServicesToDays';
import notFoundImg from '../not_found.png';
import { loadTrip, saveTrip } from 'libs/localStorage';

// STYLES
const Wrap = styled.div`
  padding: 25px;
`;

const ResultItem = styled.div`
  // position: relative;
  // display: inline-block;
  // margin-left: 8%;
  ${media.minSmall} {
    //margin-left: 0px;
  }
`;

const Badge = styled.div`
  position: absolute;
  z-index: 10;
  font-size: 10px;
  font-weight: bold;
  top: 20px;
  left: 2px;
  background: #4183c4;
  color: white;
  padding: 0 5px;
  border-radius: 3px;
  font-weight: 300;
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

// MODULE
class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredData: [],
      totalItems: 0,
      address: props.search_query.address || undefined,
      latitude: props.search_query.latitude || undefined,
      longitude: props.search_query.longitude || undefined,
      start_date: props.search_query.start_date ? props.search_query.start_date : moment().format(),
      end_date: props.search_query.end_date
        ? props.search_query.end_date
        : moment()
            .add(1, 'days')
            .format(),
      adults: props.search_query.adults || undefined,
      children: props.search_query.childen || undefined,
      infants: props.search_query.infants || undefined,
      service_type: props.search_query.type || [],
      tags: [],
      startDate: null,
      endDate: null,
      page: props.search_query.page || 0,
      resultsCount: props.search_query.resultsCount || 0,
      limit: props.search_query.limit || 0,
    };

    const trip =
      props.routeState && props.routeState.isCreatingTripNotLoggedIn ? loadTrip() : props.trip;

    if (
      props.routeState &&
      (trip._id === props.routeState.tripId || props.routeState.isCreatingTripNotLoggedIn)
    ) {
      this.daysByService = getDaysByService(trip.services);
      this.days =
        props.routeState &&
        Array.from({ length: minutesToDays(props.routeState.duration) }).map((_, i) =>
          moment(props.routeState.startDate)
            .add(i, 'days')
            .format('MMMM DD'),
        );
      this.tripServices = props.trip.services.map(service => ({
        ...service,
        service: service.service,
      }));
    }
  }

  componentWillReceiveProps() {
    this.loadData();
    //this.setState({ totalItems: this.props.data.length });
  }

  get_query_params() {
    return {
      type: this.props.search_query.type,
      start_date: this.props.search_query.start_date,
      end_date: this.props.search_query.end_date,
      adults: this.props.search_query.adults,
      children: this.props.search_query.children,
      infants: this.props.search_query.infants,
      latitude: this.props.search_query.latitude,
      longitude: this.props.search_query.longitude,
      address: this.props.search_query.address,
      tags: this.props.search_query.tags,
      onlySmartContracts: this.props.search_query.onlySmartContracts,
      page: this.props.search_query.page || 0,
      resultsCount: this.props.search_query.resultsCount || 0,
      limit: this.props.search_query.limit || 0,
      sortBy: this.props.search_query.sortBy,
      radiusInKm: this.props.search_query.radiusInKm,
      text: this.props.search_query.text,
    };
  }

  refetch_results(param_object) {
    const query_params = this.get_query_params();
    query_params[Object.keys(param_object)[0]] = param_object[Object.keys(param_object)[0]];
    this.props.update_path(query_params, this.props.history, this.props.routeState);
  }

  loadData = item => {
    if (item !== undefined) {
      const selectedPage = item.selected + 1;
      this.refetch_results({ page: selectedPage });
    }
  };

  addToTrip = async (service, day) => {
    this.tripServices = [
      ...this.tripServices,
      {
        service,
        day,
        notes: [],
        priority: 1,
      },
    ];
    if (this.props.trip._id) {
      await axios.patch(`/trips/${this.props.trip._id}`, {
        services: this.tripServices.map(service => ({ ...service, service: service._id })),
      });
      return;
    }
    console.log({
      ...this.props.trip,
      services: this.tripServices,
    });
    saveTrip({
      ...this.props.trip,
      services: this.tripServices,
    });
  };

  removeFromTrip = async (serviceId, day) => {
    this.tripServices = this.tripServices.filter(
      service => service.service._id !== serviceId || service.day !== day,
    );
    if (this.props.trip._id) {
      await axios.patch(`/trips/${this.props.trip._id}`, {
        services: this.tripServices.map(service => ({ ...service, service: service._id })),
      });
      return;
    }
    saveTrip({
      ...this.props.trip,
      services: this.tripServices,
    });
  };

  render() {
    const { onCardOver, onCardLeave } = this.props;
    return (
      <Wrap>
        <Row>
          {!this.props.isLoadingResults &&
            this.props.data.length === 0 && (
              <section>
                {this.props.search_query.type && this.props.search_query.type[0] === 'trip' ? (
                  <NotFound>
                    <img src={notFoundImg} alt="Not found" />
                    <h3>There are no trips available in the location selected.</h3>
                    <p>
                      Be the first to create a trip for {this.props.search_query.address}, and share
                      to earn rewards!
                    </p>
                    <Button type="link" href="/trips/create">
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
            )}
          {this.props.isLoadingResults ? (
            <LoaderWithMargin>
              <Loader active inline="centered" size="massive">
                Loading Results
              </Loader>
            </LoaderWithMargin>
          ) : (
            <Grid columns={this.props.showMap ? 2 : 5} doubling stackable>
              {this.props.data.map((result, i) => (
                <Grid.Column key={result.objectId}>
                  <ResultItem>
                    <Link
                      to={
                        result.categories && result.categories.length
                          ? '/services/' + result.objectId
                          : '/trips/' + result.objectId
                      }
                    >
                      {result.contractAddress && <Badge>Decentralized</Badge>}
                      <TripCard
                        key={result.label}
                        onOver={onCardOver}
                        onLeave={onCardLeave}
                        withTooltip
                        withShadow
                        item={result}
                        isTrip={!(result.categories && result.categories.length)}
                        addToTrip={
                          this.props.routeState && {
                            id: this.props.routeState.tripId,
                            day: this.props.routeState.day,
                            days: this.days,
                            daysByService: this.daysByService,
                            addToTrip: this.addToTrip,
                            removeFromTrip: this.removeFromTrip,
                            goBackToTrip: this.props.goBackToTrip,
                          }
                        }
                      />
                    </Link>
                  </ResultItem>
                </Grid.Column>
              ))}
            </Grid>
          )}
        </Row>
        <Row style={{ visibility: this.props.isLoadingResults ? 'hidden' : 'visible' }}>
          <PaginationWrap>
            {this.props.data.length ? (
              <ReactPaginate
                pageCount={Math.ceil(
                  this.props.search_query.resultsCount / this.props.search_query.limit,
                )}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={this.loadData}
                previousClassName="previousButton"
                nextClassName="nextButton"
                forcePage={parseInt(this.props.page, 10) - 1}
              />
            ) : null}
          </PaginationWrap>
        </Row>
      </Wrap>
    );
  }
}

export default withRouter(Results);
