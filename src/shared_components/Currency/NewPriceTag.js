import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Price = styled.span`
  font-size: ${props => (props.size === 'big' ? '24px' : '18px')};
  font-weight: 500;
`;

function NewPriceTag({ basePrice, baseCurrency }) {
  return (
    <Price>
      {baseCurrency.symbol}
      {basePrice}
    </Price>
  );
}

NewPriceTag.propTypes = {
  basePrice: PropTypes.number.isRequired,
  baseCurrency: PropTypes.object.isRequired,
};

export default NewPriceTag;
