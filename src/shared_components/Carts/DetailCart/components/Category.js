// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import { FoodIcon, PlaceIcon, ActivityIcon } from './icons';

// ACTIONS/CONFIG

// STYLES
export const Category = styled.span`
  display: flex;
  font-size: 14px;
  color: #6e7885;
  text-transform: uppercase;
  align-items: center;
  margin-bottom: 10px;
`;

export const CategoryIcon = styled.span`
  display: inline-block;
  width: 19px;
  position: relative;
  left: -2px;
  margin-right: 5px;
`;

const getIcon = function(name) {
  switch (name) {
    case 'food':
      return <FoodIcon style={{ fill: '#4fb798' }} />;
    case 'place':
      return <PlaceIcon style={{ fill: '#82689a' }} />;
    case 'activity':
      return <ActivityIcon style={{ fill: '#7ba8d6' }} />;
  }
};

// MODULE
export default function CartCategory({ category }) {
  return (
    <Category>
      <CategoryIcon>{getIcon(category)}</CategoryIcon>
      {category}
    </Category>
  );
}

// Props Validation
CartCategory.propTypes = {};
