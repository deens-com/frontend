// NPM
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// COMPONENTS
import Carousel from "../../../shared_components/Carousel";
import LocationCart from "../../../shared_components/Carts/Location";
import Row from "../../../shared_components/layout/Row";

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
          <Row>
            {locations.map(item => (
              <LocationCart
                item={item}
                withShadow
                key={item.title}
                xsBasis="50%"
                mdBasis="25%"
              />
            ))}
          </Row>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}

// Props Validation
HomeSectionLocations.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object)
};
