// NPM
import React from "react";
import styled from "styled-components";

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const PriceWrap = styled.div`
  // display: flex;
`;

const Price = styled.span`
  font-size: ${props => (props.size === "big" ? "24px" : "18px")};
  font-weight: 500;
`;

const Unit = styled.span`
  font-size: 11px;
`;

// MODULE
export default function PriceTag({ size, price, currency, unit }) {
  return (
    <PriceWrap>
      <Price size={size}>
        {price}
        {currency || "$"}
      </Price>
      {unit !== "hidden" &&
       <Unit>/ person</Unit>
      }
    </PriceWrap>
  );
}

// Props Validation
PriceTag.propTypes = {};
