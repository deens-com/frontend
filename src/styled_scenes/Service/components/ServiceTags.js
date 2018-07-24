import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as SmartContractStatus from 'shared_components/SmartContract/Status';

import Tag from './Tag';

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  & > div {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const Divider = styled.div`
  border: #767676 1px solid;
  width: 1px;
  margin-top: 6px;
  margin-bottom: 10px;
`;

const ServiceTags = ({ service }) => {
  const { tags, contractAddress } = service;
  if ((!tags || !tags.length) && !contractAddress) return null;
  return (
    <TagWrap>
      {contractAddress && (
        <SmartContractStatus.Wrapper
          size="large"
          status={service.contractStatus}
          hash={service.hash}
        />
      )}
      {contractAddress && tags.length > 0 && <Divider />}
      {tags.map(tag => <Tag key={tag.label} item={tag} href={`/results?tags=${tag.label}`} />)}
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
