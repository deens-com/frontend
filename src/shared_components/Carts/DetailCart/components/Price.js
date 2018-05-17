// NPM
import React from "react";
import styled, { css } from "styled-components";

// COMPONENTS
import PriceTag from "../../components/PriceTag";

// ACTIONS/CONFIG
import { media } from "../../../../libs/styled";

// STYLES
const Amount = styled.span`
  font-weight: 500;
  ${props =>
    props.muted &&
    css`
      opacity: 0.5;
    `};
`;

const Unit = styled.span`
  font-size: 15px;

  ${props =>
    props.muted &&
    css`
      opacity: 0.5;
    `};
`;

const PriceWrap = styled.div`
  margin-bottom: 10px;

  ${Amount} {
    font-size: ${props => (props.isExpanded ? "24px" : "20px")};
  }

  ${media.minSmall} {
    ${props =>
      props.isExpanded &&
      css`
        & > span {
          display: block;
        }
      `};
  }

  ${media.minMedium} {
    margin-bottom: 15px;
  }
`;

// MODULE
export default function CartPrice({ price, currency, isExpanded }) {
  return (
    <PriceWrap isExpanded={isExpanded}>
      <Amount muted={price === "0"}>
        <PriceTag price={price} />
      </Amount>
      {isExpanded && price === "0" && <Unit muted>You pay on the spot</Unit>}
    </PriceWrap>
  );
}

// Props Validation
CartPrice.propTypes = {};
