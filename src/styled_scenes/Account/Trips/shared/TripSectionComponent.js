import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Divider, Icon, Label } from 'semantic-ui-react';

import { SectionContent } from 'shared_components/layout/Page';
import { getFormattedTripDates, generateTripSlug } from 'libs/Utils';
import Carousel from './Carousel';
import LocationCart from './Carts/Location';
import { Loader } from 'semantic-ui-react';
import I18nText from 'shared_components/I18nText';
import InfiniteScroll from 'react-infinite-scroller';

const get_label_color = status => {
  switch (status) {
    case 'public':
      return 'green';
    case 'private':
      return 'orange';
    case 'shared':
    case 'unlisted':
      return 'blue';
    default:
      break;
  }
};

const CarouselWrapper = styled.div`
  .slick-track {
    margin-left: 0px;
  }
`;

const EmptyServicesText = styled.p`
  font-style: italic;
  color: #a3a9b2;
`;

const InlineH2 = styled.h2`
  display: inline;
`;

const TripTitleRow = styled.span`
  vertical-align: middle;
  a:not(:first-child) {
    margin-left: 24px;
  }
`;

const ColoredText = styled.p`
  color: #b3a7a7;
`;

const LoaderWrapper = styled.div`
  margin-top: 100px;
`;

const renderService = ({ service }, index) => (
  <LocationCart item={service} index={index} key={service._id} />
);

class Trip extends React.PureComponent {
  render() {
    const { trip } = this.props;
    return (
      <SectionContent key={trip._id}>
        <Divider />
        <TripTitleRow>
          <Link to={`/trips/${generateTripSlug(trip)}`}>
            <InlineH2>
              <I18nText data={trip.title} />
            </InlineH2>
          </Link>
          {trip.bookingStatus !== 'booked' ? (
            <Button
              as={Link}
              basic
              icon
              labelPosition="left"
              size="tiny"
              to={`/trips/organize/${trip._id}`}
            >
              <Icon name="edit" />
              Edit
            </Button>
          ) : null}
        </TripTitleRow>
        <ColoredText>{getFormattedTripDates(trip)}</ColoredText>
        <Label color={get_label_color(trip.status)}>Trip visibility: {trip.status}</Label>
        {trip.bookingStatus === 'booked' ? <Label color="olive">Booked</Label> : null}
        <CarouselWrapper>
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
            {trip.services.map(renderService)}
          </Carousel>
        </CarouselWrapper>
        {trip.services.length > 0 ? null : (
          <EmptyServicesText>No scheduled services in this trip</EmptyServicesText>
        )}
      </SectionContent>
    );
  }
}

class TripSectionComponent extends React.PureComponent {
  render() {
    if (this.props.trips.length === 0 && !this.props.isLoading && this.props.totalTrips === 0) {
      return <p>You don't have any trips.</p>;
    }

    return (
      <section>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.props.fetchTrips}
          hasMore={
            this.props.totalTrips === null || this.props.totalTrips > this.props.trips.length
          }
          loader={
            <LoaderWrapper>
              <Loader active inline="centered" size="big">
                Loading
              </Loader>
            </LoaderWrapper>
          }
        >
          {this.props.trips.map(trip => (
            <Trip key={trip._id} trip={trip} />
          ))}
        </InfiniteScroll>
      </section>
    );
  }
}

export default TripSectionComponent;
