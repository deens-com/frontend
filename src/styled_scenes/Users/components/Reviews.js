import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import GenericReview from '../../../shared_components/GenericReview';
import { SectionWrap, SectionHeader } from '../../../shared_components/layout/Page';
import Carousel from '../../../shared_components/Carousel';

// Left aligns the Carousel items when there are less number of items
const CarouselWrap = styled.div`
  .slick-track {
    margin: 0;
  }
`;

const Reviews = ({ title, reviews }) => {
  return (
    <SectionWrap>
      <SectionHeader>
        <h3>{title}</h3>
      </SectionHeader>
      <CarouselWrap>
        {reviews && (
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={3} xl_slides_nb={4}>
            {reviews.map(r => <GenericReview key={r.objectId} {...r} />)}
          </Carousel>
        )}
      </CarouselWrap>
    </SectionWrap>
  );
};

Reviews.propTypes = {
  title: PropTypes.string.isRequired,
  reviews: PropTypes.array,
};

export default Reviews;
