import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TripCart from '../../../shared_components/Carts/Trip';
import Carousel from '../../../shared_components/Carousel';
import { SectionWrap, SectionHeader } from '../../../shared_components/layout/Page';
import LocationCart from '../../../shared_components/Carts/Location';

// Left aligns the Carousel items when there are less number of items
const CarouselWrap = styled.div`
  .slick-track {
    margin: 0;
  }
`;

const EmptyText = styled.h4`
  color: #a3a9b2;
  font-style: italic;
`;

const getLink = item => `/${item.type}s/${item.objectId}`;

const UsersTripsServices = ({ title, items, emptyText }) => {
  return (
    <SectionWrap>
      <SectionHeader>
        <h3>{title}</h3>
      </SectionHeader>
      <CarouselWrap>
        {items.length > 0 && (
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={3} xl_slides_nb={4}>
            {items.map((item, index) => (
              <Link to={getLink(item)} key={item.objectId}>
                <LocationCart item={item} index={index} />
              </Link>
            ))}
          </Carousel>
        )}
        {items.length === 0 && <EmptyText>{emptyText}</EmptyText>}
      </CarouselWrap>
    </SectionWrap>
  );
};

UsersTripsServices.propTypes = {
  title: PropTypes.string.isRequired,
  emptyText: PropTypes.string,
  items: PropTypes.array,
};

UsersTripsServices.defaultProps = {
  items: [],
};

export default UsersTripsServices;
