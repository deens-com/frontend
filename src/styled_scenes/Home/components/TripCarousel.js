import React from 'react';
import styled from 'styled-components';
import Carousel from '../../../shared_components/Carousel';
import LocationCart from '../../../shared_components/Carts/Trip';

const Center = styled.div`
  text-align: center;
`;

export default ({ trips, hideAuthor }) => (
  <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={3} xl_slides_nb={4}>
    {trips &&
      trips.map(item => (
        <Center key={item._id}>
          <LocationCart hideAuthor={hideAuthor} item={item} />
        </Center>
      ))}
  </Carousel>
);
