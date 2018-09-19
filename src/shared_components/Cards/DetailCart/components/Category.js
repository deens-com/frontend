// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import { FoodIcon, PlaceIcon, ActivityIcon } from './icons';
import I18nText from 'shared_components/I18nText';

// ACTIONS/CONFIG
import { media } from 'libs/styled';

// STYLES
const iconColors = {
  food: '#4fb798',
  place: '#82689a',
  accommodation: '#82689a',
  activity: '#7ba8d6',
};

export const Category = styled.span`
  display: flex;
  font-size: 12px;
  color: #6e7885;
  text-transform: uppercase;
  align-items: center;
  margin-bottom: 10px;

  ${media.minMedium} {
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

export const CategoryIcon = styled.span`
  display: inline-block;
  position: relative;
  left: -2px;
  font-size: 14px;
  color: ${props => iconColors[props.theme.toLowerCase()]};

  ${media.minSmall} {
    font-size: 16px;
  }

  ${media.minMedium} {
    font-size: 18px;
    margin-right: 3px;
  }
`;

const getIcon = function(englishName) {
  switch (englishName.toLowerCase()) {
    case 'food':
      return <FoodIcon style={{ fill: '#4fb798' }} />;
    case 'place':
    case 'accommodation':
      return <PlaceIcon style={{ fill: '#82689a' }} />;
    case 'activity':
      return <ActivityIcon style={{ fill: '#7ba8d6' }} />;
    default:
      return false;
  }
};

// MODULE
export default function CartCategory({ category }) {
  const englishName = category.names['en-us'];
  return (
    <Category>
      <CategoryIcon theme={englishName}>{getIcon(englishName)}</CategoryIcon>
      <I18nText data={category.names} />
    </Category>
  );
}

CartCategory.propTypes = {
  category: PropTypes.shape({
    names: PropTypes.shape({
      'en-us': PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

// Props Validation
CartCategory.propTypes = {};
