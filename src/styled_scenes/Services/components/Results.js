// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
export default function Results(props) {
  return (
    <Wrap>
      <Header>
        <h4>{props.service_type} for you</h4>
      </Header>
      <Row>
        {props.data.map(result => (
          <Link to={(result.type ? "/services/" : "/trips/") + result.objectId}>
            <TripCart
              key={result.label}
              withTooltip
              withShadow
              item={result}
            />
          </Link>
        ))}
      </Row>
    </Wrap>
  );
}

// Props Validation
Results.propTypes = {};
