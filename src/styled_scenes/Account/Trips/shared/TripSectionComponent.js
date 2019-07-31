import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Divider, Icon, Label } from 'semantic-ui-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import TrashCan from 'shared_components/icons/TrashCan';
import { error } from 'libs/colors';
import { SectionContent } from 'shared_components/layout/Page';
import { getFormattedTripDates, generateTripSlug } from 'libs/Utils';
import Carousel from './Carousel';
import LocationCart from './Carts/Location';
import { Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import urls from 'libs/urlGenerator';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

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
  display: flex;
  align-items: center;
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

const DeleteTrip = styled.div`
  margin-left: 8px;
  cursor: pointer;
  > svg {
    fill: ${error} !important;
    height: 0.8em;
    width: 0.8em;
  }
`;

const renderService = (service, index) => (
  <LocationCart item={service.service} index={index} key={service._id} />
);

class Trip extends React.PureComponent {
  render() {
    const { trip } = this.props;
    return (
      <SectionContent key={trip._id}>
        <Divider />
        <TripTitleRow>
          <Link
            to={urls.trip.view({
              slug: generateTripSlug(trip),
              id: trip._id,
            })}
          >
            <InlineH2>{trip.title}</InlineH2>
          </Link>
          {!trip.bookingStatus ? (
            <span style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
              <Button
                as={Link}
                basic
                icon
                labelPosition="left"
                size="tiny"
                to={urls.trip.organize(trip._id)}
              >
                <Icon name="edit" />
                <Trans>Edit</Trans>
              </Button>
              <I18n>
                {({ i18n }) => (
                  <Modal
                    trigger={
                      <DeleteTrip>
                        <TrashCan />
                      </DeleteTrip>
                    }
                    header={i18n._(t`Delete trip`)}
                    content={i18n._(t`Are you sure you want to delete this trip?`)}
                    actions={[
                      i18n._(t`Keep trip`),
                      {
                        key: 'delete',
                        content: i18n._(t`Delete`),
                        negative: true,
                        onClick: () => this.props.onDelete(this.props.trip._id),
                      },
                    ]}
                  />
                )}
              </I18n>
            </span>
          ) : null}
        </TripTitleRow>
        {trip.startDate && <ColoredText>{getFormattedTripDates(trip)}</ColoredText>}
        <Label color={get_label_color(trip.status)}>
          {trip.privacy === 'private' ? (
            <Trans>Private</Trans>
          ) : trip.privacy === 'unlisted' ? (
            <Trans>Shared</Trans>
          ) : (
            <Trans>Public</Trans>
          )}
        </Label>
        {trip.bookingStatus === 'booked' ? (
          <Label color="olive">
            <Trans>Booked</Trans>
          </Label>
        ) : null}
        {trip.bookingStatus === 'cancelled-by-user' ? <Label color="red">Cancelled</Label> : null}
        <CarouselWrapper>
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
            {trip.services.map(renderService)}
          </Carousel>
        </CarouselWrapper>
        {trip.services.length > 0 ? null : (
          <EmptyServicesText>
            <Trans>This trip is empty</Trans>
          </EmptyServicesText>
        )}
      </SectionContent>
    );
  }
}

class TripSectionComponent extends React.PureComponent {
  render() {
    if (this.props.trips.length === 0 && !this.props.isLoading && this.props.totalTrips === 0) {
      return (
        <p>
          <Trans>You don't have any trips.</Trans>
        </p>
      );
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
            <LoaderWrapper key="loader">
              <Loader active inline="centered" size="big">
                <Trans>Loading</Trans>
              </Loader>
            </LoaderWrapper>
          }
        >
          {this.props.trips.map(trip => (
            <Trip onDelete={this.props.onDelete} key={trip._id} trip={trip} />
          ))}
        </InfiniteScroll>
      </section>
    );
  }
}

export default TripSectionComponent;
