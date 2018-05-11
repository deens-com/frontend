// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import Price from "./components/Price";
import Button from "../../Button";
import Row from "../../layout/Row";
import Col from "../../layout/Col";
import Category from "./components/Category";
import Description from "./components/Description";
import Detail from "./components/Detail";

// ACTIONS/CONFIG
import { media } from "../../../libs/styled";

// STYLES
import { ContentWrap } from "../styles";

const CartRow = styled.div`
  ${media.minSmall} {
    display: flex;
  }
`;

const LeftCol = styled.div`
  display: inline-block;
  width: 100%;
  margin-bottom: 15px;

  // COMMENT: this is for the detial item
  & > div {
    position: relative;
    top: 2px;
  }

  ${media.minSmall} {
    width: 75%;
    margin-bottom: 0;
  }
`;

const RightCol = styled.div`
  display: inline-block;
  padding-top: 15px;
  border-top: 1px solid #eee;
  width: 100%;

  ${media.minSmall} {
    border-top: none;
    width: 25%;
    text-align: right;
    padding-top: 0;
  }

  ${media.minMedium} {
    // padding: 25px;
  }
`;

// MODULE
export default function Exceprt({ data, toggleExpansion }) {
  return (
    <ContentWrap>
      <CartRow>
        <LeftCol>
          <Category category={data.type} />
          <Description description={data.description} type="inline-block" />
          <Detail inline icon="clock" text={data.openingTime} />
        </LeftCol>
        <RightCol>
          <Price price={data.pricePerSession} currency={data.currency} />
          <Button
            type="button"
            onClick={toggleExpansion}
            text="More info"
            size="text"
            iconAfter="arrowDown"
            theme="textGreen"
          />
        </RightCol>
      </CartRow>
    </ContentWrap>
  );
}

// Props Validation
Exceprt.propTypes = {};
