// NPM
import React from "react";
import PropTypes from "prop-types";

// COMPONENTS
import Carousel from "../../../shared_components/Carousel";
import Tag from "../../../shared_components/Tag";

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent
} from "../../../shared_components/layout/Page";

export default function HomeSectionMood({ tags }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>What is your mood?</h3>
        </SectionHeader>
        <SectionContent>
          <Carousel
            sm_slides_nb={2}
            md_slides_nb={3}
            lg_slides_nb={4}
            xl_slides_nb={5}
            >
            {tags.map(item => (
              <Tag
                key={item.label}
                size="large"
                item={item}

              />
            ))}
          </Carousel>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}

// Props Validation
HomeSectionMood.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object)
};
