import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tag from 'shared_components/Tag';

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  & > div {
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 50px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const ServiceTags = ({ service }) => {
  const { tags } = service;
  if (!tags || !tags.length) return null;
  return (
    <TagWrap>
      {tags.map(tag => (
        <Tag key={tag.label} item={tag} href={`/results?tags=${tag.label}`} />
      ))}
    </TagWrap>
  );
};

ServiceTags.propTypes = {
  service: PropTypes.object,
};

ServiceTags.defaultProps = {
  service: {},
};

export default ServiceTags;
