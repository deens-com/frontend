// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'gatsby-link';

// COMPONENTS
import Rating from '../Rating';
import PriceTag from './PriceTag';
import Thumb from './Thumb';

// ACTIONS/CONFIG

// STYLES
import { Cart } from './styles';

const ContentWrap = styled.div`
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;

  a {
    color: inherit;
  }
`;

const Excerpt = styled.p`
  color: #6e7885;
  line-height: 1.5;
  margin-bottom: 15px;
  height: 48px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Label = styled.span`
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  color: #6e7885;
  margin-bottom: 5px;
`;

// MODULE
export default function TripCart({ item }) {
  return (
    <Cart withShadow column>
      <Thumb url={item.img} />
      <ContentWrap>
        <Title>
          <Link to="/">{item.title}</Link>
        </Title>
        <Excerpt>{item.excerpt}</Excerpt>
        <Rating marginBottom="25px" rating={item.rating} count={item.reviews} />
        <Label>Starting from</Label>
        <PriceTag price={item.price} />
      </ContentWrap>
    </Cart>
  );
}

// Props Validation
TripCart.propTypes = {};
