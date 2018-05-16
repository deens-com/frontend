// NPM
import React from "react";
import styled from "styled-components";

// COMPONENTS
import Carousel from "../../../shared_components/Carousel";
import Tag from "./Tag";

// STYLES
const Wrap = styled.div`
  padding: 25px;
  border-bottom: 1px solid #eef1f4;
`;

// MODULE
export default function CarouselPicker(props) {
  return (
    <Wrap>
      <Carousel
        sm_slides_nb={3}
        md_slides_nb={5}
        lg_slides_nb={5}
        xl_slides_nb={6}
      >
        {props.carousel_tags.map(item => (
          <Tag
            key={item.label}
            size="medium"
            item={item}
            {...props}
          />
        ))}
      </Carousel>
    </Wrap>
  );
}

// Props Validation
CarouselPicker.propTypes = {};
