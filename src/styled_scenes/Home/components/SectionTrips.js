import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Carousel from "../../../shared_components/Carousel";
import LocationCart from "../../../shared_components/Carts/Location";

import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent,
  More
} from "../../../shared_components/layout/Page";

export default function HomeSectionTrips({ trips }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Amazing Trips</h3>
          <More>
            <Link to="/results?type=trip">All trips</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel show="4" length={trips.length} shadowInside>
            {trips.map(item => (
              <LocationCart
                item={item}
                withShadow
                key={item.title}
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

HomeSectionTrips.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object)
};
