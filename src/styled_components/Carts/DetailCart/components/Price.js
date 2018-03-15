// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG
import Utils from '../../../../libs/Utils';

// STYLES
const Amount = styled.span`
  font-weight: 500;
`;

const Unit = styled.span`
  font-size: 15px;
`;

const PriceWrap = styled.div`
  ${Amount} {
    font-size: ${props => (props.isExpanded ? '24px' : '20px')};
  }

  ${props =>
    props.isExpanded &&
    css`
      & > span {
        display: block;
      }
    `};
`;

// MODULE
export default function CartPrice({ price, currency, isExpanded }) {
  return (
    <PriceWrap isExpanded={isExpanded}>
      <Amount>
        {price}
        {Utils.getBaseSymbol(currency)}
      </Amount>
      {isExpanded && price === '0' ? <Unit>You pay on the spot</Unit> : <Unit>/person</Unit>}
    </PriceWrap>
  );
}

// Props Validation
CartPrice.propTypes = {};
