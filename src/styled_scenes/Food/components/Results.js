// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import Col from "../../../shared_components/layout/Col";
import Row from "../../../shared_components/layout/Row";
import TripCart from "../../../shared_components/Carts/Trip";
import Button from "../../../shared_components/Button";

// ACTIONS/CONFIG
import { media } from "../../../libs/styled";
import { trip } from "../../../data/trip";

// STYLES
const Wrap = styled.div`
  padding: 25px;
`;

const Header = styled.div`
  margin-bottom: 25px;

  h4 {
    font-size: 24px;
  }
`;

// MODULE
export default function FoodResutls({ data }) {
  return (
    <Wrap>
      <Header>
        <h4>Food for you</h4>
      </Header>
      <Row>
        {data.map(result => (
          <TripCart
            key={result.label}
            withTooltip
            withShadow
            item={result}
            href="/food/detail"
          />
        ))}
      </Row>
    </Wrap>
  );
}

// Props Validation
FoodResutls.propTypes = {};
