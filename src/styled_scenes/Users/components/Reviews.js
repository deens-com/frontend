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

const EmptyText = styled.h4`
  color: #a3a9b2;
  font-style: italic;
`;

const Reviews = ({ title, reviews, emptyText }) => {
  return (
    <SectionWrap>
      <SectionHeader>
        <h3>{title}</h3>
      </SectionHeader>
      <CarouselWrap>
        {reviews.length > 0 && (
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={3} xl_slides_nb={4}>
            {reviews.map(r => <GenericReview key={r.objectId} {...r} link={`/${r.reviewedType}s/${r.reviewedId}`} />)}
          </Carousel>
        )}
        {reviews.length === 0 && <EmptyText>{emptyText}</EmptyText>}
      </CarouselWrap>
    </SectionWrap>
  );
};

Reviews.propTypes = {
  title: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  reviews: PropTypes.array,
};

Reviews.defaultProps = {
  reviews: [],
};

export default Reviews;
