// NPM
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// COMPONENTS
import Carousel from "../../../components/Carousel";
import LocationCart from "../../../components/Carts/Location";

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent,
  More
} from "../../../components/layout/Page";

// MODULE
export default function HomeSectionLocations({ locations }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Exciting Activities</h3>
          <More>
            <Link to="/activities">All experiences</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel show="4" length={locations.length} shadowInside withLoader>
            {locations.map(item => (
              <LocationCart
                item={item}
                withShadow
                key={item.title}
                xsBasis="50%"
                mdBasis="25%"
              />
            ))}
          </Carousel>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}

// Props Validation
HomeSectionLocations.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object)
};
