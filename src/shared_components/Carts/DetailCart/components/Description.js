// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS

// ACTIONS/CONFIG
import { media } from "../../../../libs/styled";

// STYLES
const Description = styled.span`
  display: ${props => props.type || "block"};
  margin-right: 15px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;

  ${media.minMedium} {
    font-size: 22px;
  }
`;

// MODULE
export default function CartDescription({ description, type }) {
  return <Description type={type}>{description}</Description>;
}

// Props Validation
CartDescription.propTypes = {};
