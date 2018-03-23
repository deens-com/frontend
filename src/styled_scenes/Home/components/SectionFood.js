// NPM
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// COMPONENTS
import Carousel from "../../../shared_components/Carousel";
import TripCart from "../../../shared_components/Carts/Trip";

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent,
  More
} from "../../../shared_components/layout/Page";

// MODULE
export default function HomeSectionFood({ foods }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Delicious food</h3>
          <More>
            <Link to="/food">All foods</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel show="4" length={foods.length} shadowInside withLoader>
            {foods.map(item => (
              <TripCart item={item} withShadow key={item.title} />
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
