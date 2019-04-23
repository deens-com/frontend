import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropdown from 'shared_components/Dropdown';
import 'react-input-range/lib/css/index.css';

import { primary, textLight } from 'libs/colors';

const Content = styled.ol`
  padding: 5px 10px;
  list-style: none;
`;

const Level = styled.li`
  padding: 5px;
  cursor: pointer;
  ${props =>
    props.selected &&
    `
    color: ${textLight};
    background-color: ${primary};
  `};
`;

const PriceTags = ({ priceTags, onApply }) => {
  const [priceLevel, setPriceLevel] = useState(priceTags);

  const onToggleLevel = level => {
    if (priceLevel.includes(level)) {
      setPriceLevel(priceLevel.filter(currentLevel => currentLevel !== level));
      return;
    }
    setPriceLevel([...priceLevel, level].sort());
  };

  const renderTrigger = () => {
    if (priceTags.length === 0) {
      return 'Price';
    }

    return priceTags.map(num => '$'.repeat(num)).join(', ');
  };

  const onClose = () => {
    onApply({
      priceLevel: priceLevel.length > 0 ? priceLevel : undefined,
    });
  };

  return (
    <Dropdown onClose={onClose} trigger={renderTrigger()}>
      <Content>
        <Level selected={priceLevel.includes(1)} onClick={() => onToggleLevel(1)}>
          $
        </Level>
        <Level selected={priceLevel.includes(2)} onClick={() => onToggleLevel(2)}>
          $$
        </Level>
        <Level selected={priceLevel.includes(3)} onClick={() => onToggleLevel(3)}>
          $$$
        </Level>
        <Level selected={priceLevel.includes(4)} onClick={() => onToggleLevel(4)}>
          $$$$
        </Level>
      </Content>
    </Dropdown>
  );
};

PriceTags.propTypes = {
  onApply: PropTypes.func.isRequired,
  priceTags: PropTypes.arrayOf(PropTypes.number),
};

PriceTags.defaultProps = {
  priceTags: [],
};

export default PriceTags;
