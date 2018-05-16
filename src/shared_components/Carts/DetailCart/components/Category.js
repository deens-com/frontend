// NPM
import React from "react";
import styled from "styled-components";

// COMPONENTS
import { FoodIcon, PlaceIcon, ActivityIcon } from "./icons";

// ACTIONS/CONFIG
import { media } from "../../../../libs/styled";

// STYLES
const iconColors = {
  food: "#4fb798",
  place: "#82689a",
  activity: "#7ba8d6"
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
  color: ${props => iconColors[props.theme]};

  ${media.minSmall} {
    font-size: 16px;
  }

  ${media.minMedium} {
    font-size: 18px;
    margin-right: 3px;
  }
`;

const getIcon = function(name) {
  switch (name) {
    case "food":
      return <FoodIcon style={{ fill: "#4fb798" }} />;
    case "place":
      return <PlaceIcon style={{ fill: "#82689a" }} />;
    case "activity":
      return <ActivityIcon style={{ fill: "#7ba8d6" }} />;
    default:
      return false;
  }
};

// MODULE
export default function CartCategory({ category }) {
  return (
    <Category>
      <CategoryIcon theme={category}>{getIcon(category)}</CategoryIcon>
      {category}
    </Category>
  );
}

// Props Validation
CartCategory.propTypes = {};
