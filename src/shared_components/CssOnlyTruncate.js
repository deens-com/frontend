import React from 'react';
import styled from 'styled-components';

/**
 * Copied from: https://stackoverflow.com/a/38336292
 */

const TruncateContainer = styled.div`
  position: relative;
  display: block;
  width: 100%;
  height: calc(2em + 5px);
  overflow: hidden;
  white-space: normal;
`;

const TruncateContent = styled.span`
  /* word-break: break-all; */
  position: relative;
  display: block;
  max-height: 3em;
`;

const Ellipsis = styled.div`
  position: absolute;
  right: 0;
  top: calc(4em + 2px - 100%);
  text-align: left;
  background: transparent;
`;

const CssOnlyTruncate = props => {
  const { children } = props;
  return (
    <TruncateContainer>
      <TruncateContent>
        {children}
        <Ellipsis>...</Ellipsis>
      </TruncateContent>
    </TruncateContainer>
  );
};

export default CssOnlyTruncate;
