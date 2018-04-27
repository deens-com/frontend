// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

// COMPONENTS
import Rating from "../Rating";
import PriceTag from "./components/PriceTag";
import Thumb from "./components/Thumb";
import Col from "../layout/Col";
import { PinIcon } from "../icons";

// ACTIONS/CONFIG

// STYLES
import { Cart } from "./styles";

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

const Location = styled.span`
  color: #6e7885;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 2px;
    fill: #d3d7dc;
    position: relative;
    left: -3px;
  }
`;

// MODULE
export default function LocationCart({
  item,
  href,
  withShadow,
  smBasis,
  xsBasis,
  mdBasis
}) {
  return (
    <Col xsBasis={xsBasis} mdBasis={mdBasis} smBasis={smBasis}>
      <Cart withShadow={withShadow} column>
        <Thumb url={item.image} />
        <ContentWrap>
          <Title>
            <h3>{item.title}</h3>
          </Title>
          <Excerpt>{item.excerpt}</Excerpt>
          {item.type &&
            <Location>
              <PinIcon />
              {item.location}
            </Location>
          }
          <Rating
            marginBottom="25px"
            rating={item.rating}
            count={item.reviewCount}
          />
          <Label>Starting from</Label>
          <PriceTag price={item.price} />
        </ContentWrap>
      </Cart>
    </Col>
  );
}

// Props Validation
LocationCart.propTypes = {};
