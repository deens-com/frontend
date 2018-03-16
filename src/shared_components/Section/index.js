// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'gatsby-link';

// COMPONENTS
import Row from '../layout/Row';
import Col from '../layout/Col';
import { Arrow, Pin } from '../icons';
import Rating from '../Rating';
import TripCart from '../Carts/Trip';
import LocationCart from '../Carts/Location';
import Carousel from '../Carousel';

// ACTIONS/CONFIG

// STYLE
import { Cart, CartLink, CategoryThumb, CategoryArrow } from '../Carts/styles';
import { PageWrapper, SectionWrap, SectionHeader, SectionContent } from '../layout/Page';

const Tag = styled.span`
  padding: 0px 15px;
  font-size: 18px;
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const More = styled.div`
  margin-left: auto;
`;

const Location = styled.span`
  color: #6e7885;
  margin-bottom: 15px;
  display: block;
`;

const Icon = styled.span`
  margin-right: 2px;
  width: 17px;
  display: inline-block;
  position: relative;
  left: -3px;
  top: 2px;
`;

// MODULE
export default function Section({ title, type, headerLink, data }) {
  let row;

  switch (type) {
    case 'category': {
      row = (
        <Row margin="100px -10px 0">
          {data.map(item => (
            <Col key={item.label} smBasis="50%" mdBasis="25%">
              <Cart withShadow>
                <CartLink to={item.href}>
                  <CategoryThumb>
                    <img src={item.img} />
                  </CategoryThumb>
                  <Tag>{item.label}</Tag>
                  <CategoryArrow>
                    <Arrow style={{ fill: '#50a18a' }} />
                  </CategoryArrow>
                </CartLink>
              </Cart>
            </Col>
          ))}
        </Row>
      );
      break;
    }

    case 'tag': {
      row = (
        <Row>
          {data.map(item => (
            <Col key={item.label}>
              <Cart
                textAlign="center"
                height="76px"
                withShadow
                hoverBg={item.hoverBg}
                background={item.background}
                linkColor={item.linkColor}
              >
                <CartLink to="/">
                  <Tag>{item.label}</Tag>
                </CartLink>
              </Cart>
            </Col>
          ))}
        </Row>
      );
      break;
    }

    case 'trip': {
      row = (
        <Row>
          {data.map(item => (
            <Col key={item.title} xsBasis="50%" mdBasis="25%">
              <TripCart item={item} />
            </Col>
          ))}
        </Row>
      );
      break;
    }

    case 'location': {
      row = (
        <Row>
          {data.map(item => (
            <Col key={item.title} xsBasis="50%" mdBasis="25%">
              <LocationCart item={item} />
            </Col>
          ))}
        </Row>
      );
      break;
    }

    default:
      row = <span>No type specified</span>;
      break;
  }

  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>{title}</h3>
          {headerLink && (
            <More>
              <Link to={headerLink.href}>{headerLink.text}</Link>
            </More>
          )}
        </SectionHeader>
        <SectionContent>{row}</SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}

// Props Validation
Section.propTypes = {};
