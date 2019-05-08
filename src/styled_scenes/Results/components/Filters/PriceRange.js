import React, { useState, useEffect } from 'react';
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

const PriceRange = ({
  minPrice,
  maxPrice,
  maxPossiblePrice,
  minPossiblePrice,
  onApply,
  pricePer,
  numberOfPeople,
  onlyMax,
}) => {
  const defaultMin = minPossiblePrice || MIN_PRICE;
  const defaultMax = maxPossiblePrice || MAX_PRICE;
  const [values, setValues] = useState({
    min: minPrice || defaultMin,
    max: maxPrice || defaultMax,
  });

  useEffect(
    () => {
      const min = minPrice < defaultMin ? defaultMin : minPrice;
      const max = maxPrice > defaultMax ? defaultMax : maxPrice;

      setValues({ min: min || defaultMin, max: max || defaultMax });
    },
    [defaultMin, defaultMax],
  );

  const onChange = newValues => {
    if (onlyMax) {
      setValues({ ...values, max: newValues });
      return;
    }
    setValues(newValues);
  };

  const renderTrigger = () => {
    if (!values.min && !maxPrice) {
      return 'Select price';
    }
    const isMaxPrice = maxPrice === defaultMax || !maxPrice;
    return `$${values.min || defaultMin} to $${maxPrice || defaultMax}${
      isMaxPrice ? '+' : ''
    } ${pricePer}`;
  };

  const onClose = () => {
    onApply({
      priceStart: values.min > defaultMin ? values.min : undefined,
      priceEnd: values.max < defaultMax ? values.max : undefined,
    });
  };

  const showTotalPrice = pricePer === 'per person' && numberOfPeople > 1;

  return (
    <Dropdown onClose={onClose} trigger={renderTrigger()}>
      <Content style={{ width: '250px' }}>
        <Range
          maxValue={defaultMax}
          minValue={defaultMin}
          value={onlyMax ? values.max : values}
          onChange={onChange}
          formatLabel={value => `$${value}`}
        />
        <PerDay>
          {showTotalPrice && (
            <span>
              ${values.min * numberOfPeople} to ${values.max * numberOfPeople}
              {values.max === defaultMax ? '+' : ''} for {numberOfPeople} people
            </span>
          )}
          <span>
            {showTotalPrice && '('}${values.min} to ${values.max}
            {values.max === defaultMax ? '+' : ''} {pricePer}
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
  minPossiblePrice: PropTypes.number,
  maxPossiblePrice: PropTypes.number,
  pricePer: PropTypes.oneOf(['per day', 'per person']),
  numberOfPeople: PropTypes.number,
  onlyMax: PropTypes.bool,
};

PriceRange.defaultProps = {
  pricePer: 'per day',
  onlyMax: false,
};

export default PriceRange;
