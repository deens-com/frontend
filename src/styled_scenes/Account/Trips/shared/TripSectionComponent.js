import React from 'react';
import {Link} from "react-router-dom";
import {SectionContent} from "./../../../../shared_components/layout/Page";
import Carousel from "./../../../../shared_components/Carousel";
import LocationCart from "./../../../../shared_components/Carts/Location";
import moment from "moment";
import uuid from 'uuid/v1';
import { Divider, Label } from 'semantic-ui-react';
import styled from "styled-components";

const get_label_color = (status) => {
  switch(status){
    case "public":
      return "green";
    case "private":
      return "orange";
    case "shared":
      return "blue";
    default:
      break;
  }
}

const CarouselWrapper = styled.div`
  .slick-track{
    margin-left: 0px;
  }
`;


const TripSectionComponent = props => {
  return (
    <section>
      {props.trips.map((trip, index) => (
        <SectionContent key={uuid()}>
          <Divider/>
          <Link to={"/trips/" + trip.objectId}>
            <h2>{trip.title}</h2>
          </Link>
          <p style={{color: "#b3a7a7"}}>
            {trip.beginDate && trip.beginDate.iso && moment(trip.beginDate.iso).format('L')} -{' '}
            {trip.endDate && trip.endDate.iso && moment(trip.endDate.iso).format('L')}
          </p>
          <Label color={get_label_color(trip.status)}>
            {trip.status}
          </Label>
          <br/><br/>
          <CarouselWrapper>
            <Carousel
              sm_slides_nb={1}
              md_slides_nb={2}
              lg_slides_nb={4}
              xl_slides_nb={4}>
              {trip.services.map((item, index) => (
                <Link to={"/services/" + item.objectId} key={uuid()}>
                  <LocationCart
                    item={item}
                    index={index}
                    />
                </Link>
              ))}
            </Carousel>
          </CarouselWrapper>
          <br/>
        </SectionContent>
      ))}
    </section>
  );
};

export default TripSectionComponent;
