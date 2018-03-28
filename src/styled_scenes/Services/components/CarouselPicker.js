// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import Carousel from "../../../shared_components/Carousel";
import Tag from "../../../shared_components/Tag";

// ACTIONS/CONFIG
import { tags } from "../../../data/food";

// STYLES
const Wrap = styled.div`
  padding: 25px;
  border-bottom: 1px solid #eef1f4;
`;

// MODULE
export default function CarouselPicker({}) {
  return (
    <Wrap>
      <Carousel
        show="7"
        length={tags.length}
        shadowInside
        withLoader
        size="small"
      >
        {tags.map(item => (
          <Tag
            key={item.label}
            size="medium"
            item={item}
            withShadow
            withColumn
            xsBasis="50%"
            mdBasis="14.28%"
          />
        ))}
      </Carousel>
    </Wrap>
  );
}

// Props Validation
CarouselPicker.propTypes = {};
