// NPM
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// COMPONENTS
import Carousel from "../../../shared_components/Carousel";
import LocationCart from "../../../shared_components/Carts/Location";

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent,
  More
} from "../../../shared_components/layout/Page";

export default function HomeSectionFood({ foods }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Delicious food</h3>
          <More>
            <Link to="/results?service_types=food">All foods</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel
            sm_slides_nb={1}
            md_slides_nb={2}
            lg_slides_nb={4}
            xl_slides_nb={4}>
            {foods.map(item => (
              <Link to={"/services/" + item.objectId}>
                <LocationCart
                  item={item}
                  withShadow
                  key={item.title}
                />
              </Link>
            ))}
          </Carousel>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}

// Props Validation
HomeSectionFood.propTypes = {
  foods: PropTypes.arrayOf(PropTypes.object)
};
