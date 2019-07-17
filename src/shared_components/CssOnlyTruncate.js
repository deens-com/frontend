import React from 'react';
import styled from 'styled-components';

/**
 * Copied from: https://stackoverflow.com/a/38336292
 */

const TruncateContainer = styled.span`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const CssOnlyTruncate = props => {
  const { children } = props;
  return <TruncateContainer>{children}</TruncateContainer>;
};

export default CssOnlyTruncate;
