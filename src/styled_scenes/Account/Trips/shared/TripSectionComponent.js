import React from 'react';
import { Link } from 'react-router-dom';
import { SectionContent } from './../../../../shared_components/layout/Page';
import Carousel from './Carousel';
import LocationCart from './Carts/Location';
import moment from 'moment';
import { Button, Divider, Icon, Label } from 'semantic-ui-react';
import styled from 'styled-components';

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

const renderTrip = trip => {
  const linkToTrip = `/trips/${trip.objectId}`;
  return (
    <SectionContent key={trip.objectId}>
      <Divider />
      <TripTitleRow>
        <Link to={linkToTrip}>
          <InlineH2>{trip.title}</InlineH2>
        </Link>
        <Button as={Link} basic icon labelPosition="left" size="tiny" to={linkToTrip}>
          <Icon name="edit" />
          Edit
        </Button>
      </TripTitleRow>
      <ColoredText>
        {trip.beginDate && moment(trip.beginDate).format('L')} - {trip.endDate && moment(trip.endDate).format('L')}
      </ColoredText>
      <Label color={get_label_color(trip.status)}>Trip visibility: {trip.status}</Label>
      {trip.booked ? <Label color="olive">purchased</Label> : null}
      <br />
      <br />
      <CarouselWrapper>
        <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
          {trip.services.map((item, index) => <LocationCart item={item} index={index} key={item.objectId} />)}
        </Carousel>
      </CarouselWrapper>
      {trip.services.length ? null : <EmptyServicesText>No scheduled services in this trip</EmptyServicesText>}
      <br />
    </SectionContent>
  );
};

const TripSectionComponent = props => {
  return <section>{props.trips.map(renderTrip)}</section>;
};

export default TripSectionComponent;
