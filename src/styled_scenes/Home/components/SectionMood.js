// NPM
import React from "react";
import PropTypes from "prop-types";

// COMPONENTS
import Carousel from "../../../components/Carousel";
import Tag from "../../../components/Tag";

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent
} from "../../../components/layout/Page";

// MODULE
export default function HomeSectionMood({ tags }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>What is your mood?</h3>
        </SectionHeader>
        <SectionContent>
          <Carousel show="5" length={tags.length} shadowInside withLoader>
            {tags.map(item => (
              <Tag
                key={item.label}
                size="large"
                item={item}
                withShadow
                withColumn
                xsBasis="50%"
                mdBasis="20%"
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
