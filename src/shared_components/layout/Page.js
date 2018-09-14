import React from 'react';
import styled from 'styled-components';
import { Segment } from 'semantic-ui-react';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const PageWrapper = styled.div`
  max-width: 1350px;
  width: 100%;
  margin: 0 auto;
  padding: ${props => props.padding || '0 10px'};
`;

export const PageContentStyles = styled.main`
  padding: ${props => props.padding || '0'};
  display: ${props => (props.flex ? 'flex' : 'block')};
`;

export const SegmentWithoutPadding = styled(Segment)`
  && {
    padding: 0;
    margin: 0;
    min-height: 600px;
  }
`;

export const PageContent = props => {
  // _removed because sending flex=true to SegmentWithoutPadding causes SemanticUI to log an error in console
  const { flex: _removed, ...rest } = props;
  return (
    <SegmentWithoutPadding basic {...rest}>
      <PageContentStyles {...props}>{props.children}</PageContentStyles>
    </SegmentWithoutPadding>
  );
};

export const SectionWrap = styled.section`
  margin-bottom: 50px;
`;

export const More = styled.div`
  margin-left: auto;
`;

export const SectionHeader = styled.header`
  margin-bottom: 35px;
  display: flex;
  align-items: center;

  h3 {
    font-size: 24px;
  }

  a {
    color: #4fb798;
    font-weight: 500;
  }
`;

export const SectionContent = styled.div``;
