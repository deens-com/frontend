// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import Col from '../../../components/layout/Col';
import Row from '../../../components/layout/Row';
import TripCart from '../../../components/Carts/Trip';
import Button from '../../../components/Button';

// ACTIONS/CONFIG
import theme from '../../../config/theme';
import { media } from '../../../libs/styled';
import { trip } from '../../../data/trip';

// STYLES
const Wrap = styled.div`
  padding: 25px;
  padding-top: 125px;

  ${media.minMedium} {
    padding-top: 25px;
  }
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
      <Row wrap>
        {data.map(result => (
          <Col key={result.label} xsBasis="50%" lgBasis="33.33%">
            <TripCart withTooltip item={result} href="/food/detail" />
          </Col>
        ))}
      </Row>
    </Wrap>
  );
}

// Props Validation
FoodResutls.propTypes = {};
