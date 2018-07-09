import React from 'react';
import styled, { css } from 'styled-components';
import { Segment } from 'semantic-ui-react';
import { media } from '../../libs/styled';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const PageWrapper = styled.div`
  max-width: 960px;
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
  }
`;

export const PageContent = props => {
  return (
    <SegmentWithoutPadding basic {...props}>
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
