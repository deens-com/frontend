import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropdown from 'shared_components/Dropdown';
import Range from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import { primary } from 'libs/colors';
import { P } from 'libs/commonStyles';

const Content = styled.div`
  padding: 25px;

  .input-range__slider {
    background: ${primary};
    border-color: ${primary};
  }

  .input-range__track--active {
    background: ${primary};
  }

  .input-range__label-container {
    display: none;
  }
`;

const PerDay = styled(P)`
  margin-top: 15px;
  text-align: center;
  > * {
    display: block;
  }
  > *:nth-child(2) {
    margin-top: 5px;
    font-size: 14px;
  }
`;

const MAX_PRICE = 500;
const MIN_PRICE = 0;

const PriceRange = ({ minPrice, maxPrice, onApply, pricePer, numberOfPeople }) => {
  const [values, setValues] = useState({ min: minPrice || MIN_PRICE, max: maxPrice || MAX_PRICE });

  const renderTrigger = () => {
    if (!minPrice && !maxPrice) {
      return 'Select price';
    }
    const isMaxPrice = maxPrice === MAX_PRICE || !maxPrice;
    return `$${minPrice || MIN_PRICE} to $${maxPrice || MAX_PRICE}${
      isMaxPrice ? '+' : ''
    } ${pricePer}`;
  };

  const onClose = () => {
    onApply({
      priceStart: values.min > MIN_PRICE ? values.min : undefined,
      priceEnd: values.max < MAX_PRICE ? values.max : undefined,
    });
  };

  const showTotalPrice = pricePer === 'per person' && numberOfPeople > 1;

  return (
    <Dropdown onClose={onClose} trigger={renderTrigger()}>
      <Content style={{ width: '250px' }}>
        <Range
          maxValue={MAX_PRICE}
          minValue={MIN_PRICE}
          value={values}
          onChange={setValues}
          formatLabel={value => `$${value}`}
        />
        <PerDay>
          {showTotalPrice && (
            <span>
              ${values.min * numberOfPeople} to ${values.max * numberOfPeople}
              {values.max === MAX_PRICE ? '+' : ''} for {numberOfPeople} people
            </span>
          )}
          <span>
            {showTotalPrice && '('}${values.min} to ${values.max}
            {values.max === MAX_PRICE ? '+' : ''} {pricePer}
            {showTotalPrice && ')'}
          </span>
        </PerDay>
      </Content>
    </Dropdown>
  );
};

PriceRange.propTypes = {
  onApply: PropTypes.func.isRequired,
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  pricePer: PropTypes.oneOf(['per day', 'per person']),
  numberOfPeople: PropTypes.number,
};

PriceRange.defaultProps = {
  pricePer: 'per day',
};

export default PriceRange;
