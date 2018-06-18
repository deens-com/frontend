import React from 'react';
import { Link } from 'react-router-dom';
import { SectionContent } from './../../../../shared_components/layout/Page';
import Carousel from './Carousel';
import LocationCart from './../../../../shared_components/Carts/Location';
import moment from 'moment';
import { Divider, Label } from 'semantic-ui-react';
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

const TripSectionComponent = props => {
  return (
    <section>
      {props.trips.map((trip, index) => (
        <SectionContent key={trip.objectId}>
          <Divider />
          <Link to={'/trips/' + trip.objectId}>
            <h2>{trip.title}</h2>
          </Link>
          <p style={{ color: '#b3a7a7' }}>
            {trip.beginDate && moment(trip.beginDate).format('L')} - {trip.endDate && moment(trip.endDate).format('L')}
          </p>
          <Label color={get_label_color(trip.status)}>Trip visibility: {trip.status}</Label>
          {trip.booked ? <Label color="olive">purchased</Label> : null}
          <br />
          <br />
          <CarouselWrapper>
            <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
              {trip.services.map((item, index) => (
                <Link to={'/services/' + item.objectId} key={item ? item.objectId : index}>
                  <LocationCart
                    item={item}
                    index={index}
                    isUnconfirmed={props.isServiceUnConfirmed(trip.objectId, item.objectId)}
                  />
                </Link>
              ))}
            </Carousel>
          </CarouselWrapper>
          {trip.services.length ? null : <EmptyServicesText>No services in this trip</EmptyServicesText>}
          <br />
        </SectionContent>
      ))}
    </section>
  );
};

export default TripSectionComponent;
