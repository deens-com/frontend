import React from "react";
import PropTypes from "prop-types";

import Carousel from "../../../shared_components/Carousel";
import Tag from "../../../shared_components/Tag";

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
          <Carousel show="5" length={tags.length} shadowInside>
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

HomeSectionMood.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object)
};
