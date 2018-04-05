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

export default function HomeSectionPlaces({ trips }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Popular places</h3>
          <More>
            <Link to="/results?type=place">All places</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel show="4" length={trips.length} shadowInside>
            {trips.map(item => (
              <LocationCart
                item={item}
                withShadow
                key={item.objectId}
                xsBasis="100%"
                smBasis="50%"
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
HomeSectionPlaces.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object)
};
