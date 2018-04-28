import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TripCart from '../../../shared_components/Carts/Trip';
import Carousel from '../../../shared_components/Carousel';
import { SectionWrap, SectionHeader } from '../../../shared_components/layout/Page';
import LocationCart from '../../../shared_components/Carts/Location';

const UsersTrips = props => {
  const dummyTrip = {
    image: 'https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&h=350',
    title: 'Explore New York',
    excerpt: 'New York',
    rating: 4,
    reviewCount: 37,
    price: '210',
  };
  return (
    <SectionWrap>
      <SectionHeader>
        <h3>Nick's Trips</h3>
      </SectionHeader>
      <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={3} xl_slides_nb={4}>
        <Link to={'/trips/'} key={1}>
          <LocationCart item={dummyTrip} index={1} />
        </Link>
        <Link to={'/trips/'} key={1}>
          <LocationCart item={dummyTrip} index={1} />
        </Link>
        <Link to={'/trips/'} key={3}>
          <LocationCart item={dummyTrip} index={3} />
        </Link>
        <Link to={'/trips/'} key={4}>
          <LocationCart item={dummyTrip} index={4} />
        </Link>
        <Link to={'/trips/'} key={5}>
          <LocationCart item={dummyTrip} index={5} />
        </Link>
        <Link to={'/trips/'} key={6}>
          <LocationCart item={dummyTrip} index={6} />
        </Link>
      </Carousel>
    </SectionWrap>
  );
};

export default UsersTrips;
