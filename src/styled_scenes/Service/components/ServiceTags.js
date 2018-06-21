import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Tag from './Tag';

const TagWrap = styled.div`
  & > div {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const ServiceTags = ({ tags }) => {
  if (!tags || !tags.length) return null;
  return (
    <TagWrap>
      {tags.map(tag => (
        <Link to={`/results?tags=${tag.label}`}>
          <Tag key={tag.label} item={tag} />
        </Link>
      ))}
    </TagWrap>
  );
};

ServiceTags.propTypes = {
  tags: PropTypes.array,
};

export default ServiceTags;
