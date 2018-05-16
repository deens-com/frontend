// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import Rating from "../Rating";
import PriceTag from "./components/PriceTag";
import Thumb from "./components/Thumb";

// ACTIONS/CONFIG

// STYLES
import { Cart, ContentWrap } from "./styles";

const Wrap = styled.div`
  display: inline-block;
  width: 240px;
  padding: 10px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  a {
    color: inherit;
  }
`;

const Excerpt = styled.p`
  color: #6e7885;
  height: 48px;
  line-height: 1.5;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const Label = styled.span`
  color: #6e7885;
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

// MODULE
export default function TripCart({ item, withTooltip, href }) {
  return (
    <Wrap>
      <Cart column>
        <Thumb
          url={item.image}
          tripCount={item.partOf}
          withTooltip={withTooltip}
        />
        <ContentWrap>
          <Title>
            {item.title}
          </Title>
          <Excerpt>{item.excerpt}</Excerpt>
          <Rating
            marginBottom="25px"
            rating={item.rating}
            count={item.reviews}
          />
          <Label>Starting from</Label>
          <PriceTag price={item.price} />
        </ContentWrap>
      </Cart>
    </Wrap>
  );
}

// Props Validation
TripCart.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    partof: PropTypes.number,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    review: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  withTooltip: PropTypes.bool,
  href: PropTypes.string,
  withShadow: PropTypes.bool
};

// Default props
TripCart.defaultProps = {
  withTooltip: false,
  withShadow: false,
  href: "/"
};
