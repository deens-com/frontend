import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import { SectionWrap } from './../../../../shared_components/layout/Page';
import UserBasicInfo from './../../components/UserBasicInfo';
import {Link} from "react-router-dom";
import {SectionContent} from "./../../../../shared_components/layout/Page";
import Carousel from "./../../../../shared_components/Carousel";
import LocationCart from "./../../../../shared_components/Carts/Location";
import moment from "moment";
import uuid from 'uuid/v1';
import { Divider, Label } from 'semantic-ui-react';

const TripSectionComponent = props => {
  return (
    <section>
      {props.trips.map((trip, index) => (
        <SectionContent key={uuid()}>
        <Divider/>
          <h2>{trip.title}</h2>
          <p style={{color: "#b3a7a7"}}>{moment(trip.beginDate).format('L')} - {moment(trip.endDate).format('L')}</p>
          <Label color="green">
            {trip.status}
          </Label>
          <br/><br/>
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
          <br/>
        </SectionContent>
      ))}
    </section>
  );
};

export default TripSectionComponent;
