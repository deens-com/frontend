// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Link from "gatsby-link";

// COMPONENTS
import Row from "../../../shared_components/layout/Row";
import Col from "../../../shared_components/layout/Col";
import { ArrowIcon } from "../../../shared_components/icons";

// ACTIONS/CONFIG

// STYLES
import { Cart } from "../../../shared_components/Carts/styles";
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent
} from "../../../shared_components/layout/Page";

const CategoryThumb = styled.div`
  height: 88px;
  overflow: hidden;
  width: 100%;

  img {
    display: block;
    height: 100%;
    left: 0;
    position: relative;
    top: 0;
    width: auto;
  }
`;

const CartLink = styled(Link)`
  align-items: center;
  color: #3c434b;
  display: flex;
  font-weight: 500;
  min-height: 100%;
  overflow: hidden;
  width: 100%;
`;

const TagCategory = styled.span`
  display: inline-block;
  font-size: 18px;
  overflow: hidden;
  padding: 0px 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const CategoryArrow = styled.span`
  display: block;
  margin: 0 15px 0 auto;
  padding-top: 3px;
  width: 40px;
  color: #50a18a;
`;

// MODULE
export default function HomeSectionHappy({ categories }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>What makes you happy?</h3>
        </SectionHeader>
        <SectionContent>
          <Row>
            {categories.map(item => (
              <Col key={item.label} smBasis="50%" mdBasis="25%">
                <Cart withShadow>
                  <CartLink to={item.href}>
                    <CategoryThumb>
                      <img src={item.img} />
                    </CategoryThumb>
                    <TagCategory>{item.label}</TagCategory>
                    <CategoryArrow>
                      <ArrowIcon />
                    </CategoryArrow>
                  </CartLink>
                </Cart>
              </Col>
            ))}
          </Row>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}

// Props Validation
HomeSectionHappy.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object)
};
