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

export default function HomeSectionLocations({ locations }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Exciting Activities</h3>
          <More>
            <Link to="/results?service_types=activity">All experiences</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel
            sm_slides_nb={1}
            md_slides_nb={2}
            lg_slides_nb={4}
            xl_slides_nb={4}>
            {locations.map(item => (
              <LocationCart
                item={item}
                withShadow
                key={item.objectId}
                href={"/services/" + item.objectId}
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
