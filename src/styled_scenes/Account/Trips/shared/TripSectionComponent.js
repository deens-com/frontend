import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Divider, Icon, Label } from 'semantic-ui-react';

import { SectionContent } from 'shared_components/layout/Page';
import { getFormattedTripDates } from 'libs/Utils';
import Carousel from './Carousel';
import LocationCart from './Carts/Location';
import { Loader } from 'semantic-ui-react';
import I18nText from 'shared_components/I18nText';

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
  a:last-child {
    margin-left: 24px;
  }
`;

const ColoredText = styled.p`
  color: #b3a7a7;
`;

class Trip extends Component {
  static propTypes = {
    trip: PropTypes.object.isRequired,
  };

  state = {
    linkToViewTrip: `/trips/${this.props.trip.objectId}`,
    linkToEditTrip: `/trips/${this.props.trip.objectId}/edit`,
    tripDates: getFormattedTripDates(this.props.trip),
  };

  render() {
    const { trip } = this.props;
    return (
      <SectionContent key={trip.objectId}>
        <Divider />
        <TripTitleRow>
          <Link to={this.state.linkToViewTrip}>
            <InlineH2>
              <I18nText data={trip.title} />
            </InlineH2>
          </Link>
          <Button
            as={Link}
            basic
            icon
            labelPosition="left"
            size="tiny"
            to={this.state.linkToEditTrip}
          >
            <Icon name="edit" />
            Edit
          </Button>
        </TripTitleRow>
        <ColoredText>{this.state.tripDates}</ColoredText>
        <Label color={get_label_color(trip.status)}>Trip visibility: {trip.status}</Label>
        {trip.booked ? <Label color="olive">purchased</Label> : null}
        <br />
        <br />
        <CarouselWrapper>
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
            {trip.services.filter(({ service }) => !!service).map(({ service }, index) => (
              <LocationCart item={service} index={index} key={service._id} />
            ))}
          </Carousel>
        </CarouselWrapper>
        {trip.services.length ? null : (
          <EmptyServicesText>No scheduled services in this trip</EmptyServicesText>
        )}
        <br />
      </SectionContent>
    );
  }
}

const TripSectionComponent = props => {
  if (props.isLoadingTrips) {
    return (
      <Loader active inline="centered" size="massive">
        Loading
      </Loader>
    );
  }
  if (!props.trips.length) {
    return <p>You don't have any {props.tripsType} trips.</p>;
  }
  return (
    <section>
      {props.trips.map(trip => (
        <Trip key={trip.objectId} trip={trip} />
      ))}
    </section>
  );
};

export default TripSectionComponent;
