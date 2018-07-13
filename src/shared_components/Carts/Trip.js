// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Truncate from 'react-truncate';

// COMPONENTS
import Rating from "../Rating";
import PriceTag from "../Currency/PriceTag";
import Thumb from "./components/Thumb";

// ACTIONS/CONFIG

// STYLES
import { Cart, ContentWrap } from "./styles";

const Wrap = styled.div`
  display: inline-block;
  width: 240px;
  padding: 10px;
`;

// How did we come up with height: 104px?
// the max number of lines Title can render is 4
// rendered a title that long and saw how many pixels it takes 😜
const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  height: 104px;

  a {
    color: inherit;
  }
`;

const Excerpt = styled.p`
  color: #6e7885;
  height: 45px;
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
            <Truncate lines={4}>{item.title}</Truncate>
          </Title>
          { item.type &&
            <Excerpt>{item.excerpt}</Excerpt>
          }
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
