import React from 'react';
import styled from 'styled-components';
import Carousel from '../../../shared_components/Carousel';
import LocationCart from '../../../shared_components/Carts/Trip';

const Center = styled.div`
  text-align: center;
`;

const placeholderTrips = [{ _id: 0 }, { _id: 1 }, { _id: 2 }, { _id: 3 }];

const TripCarousel = ({ trips, isLoading }) => {
  const tripsToShow = isLoading ? placeholderTrips : trips;
  return (
    <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={3} xl_slides_nb={4}>
      {tripsToShow &&
        tripsToShow.map(item => (
          <Center key={item._id}>
            <LocationCart item={item} isPlaceholder={isLoading} />
          </Center>
        ))}
    </Carousel>
  );
};

export default React.memo(TripCarousel);
