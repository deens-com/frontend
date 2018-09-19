// NPM
import React from 'react';
import styled from 'styled-components';

import { media } from 'libs/styled';

import parisImg from './images/paris.jpg';
import sanFranciscoImg from './images/san-francisco.jpg';
import londonImg from './images/london.jpg';
import newYorkImg from './images/new-york.jpg';

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
} from '../../../../shared_components/layout/Page';

const SectionContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;

  ${media.minSmall} {
    max-height: 400px;
  }

  ${media.minMedium} {
    height: 400px;
    flex-direction: row;
  }
`;

const Column = styled.div`
  display: flex;
  flex: 1;
  ${media.minMedium} {
    height: 400px;
    flex-direction: column;
  }
`;

const Row = styled.div`
  height: 190px;
  background-size: cover;
  background-position: center;
  display: flex;
  border-radius: 10px;
  color: white;
  font-size: 36px;
  line-height: 42px;
  font-weight: bold;
  flex: 1;

  ${media.minSmall} {
    margin: 0;
    width: auto;
  }
  ${media.minMedium} {
    height: 400px;
  }
`;

const CenterContainer = Column.extend`
  flex-direction: column;
  order: 3;
  margin: 0;
  ${media.minSmall} {
    margin: auto 0 auto 20px;
    width: calc(50% - 10px);
  }
  ${media.minMedium} {
    order: 1;
    width: auto;
    margin: 0 20px;
    flex: 1;
  }
`;

const Paris = Row.extend`
  background-image: url(${parisImg});
  flex: 1;
  margin-bottom: 10px;
  ${media.minSmall} {
    height: 190px;
    width: calc(50% - 10px);
    margin-bottom: 20px;
  }
  ${media.minMedium} {
    height: 400px;
    margin: 0;
    width: auto;
    flex: 1;
  }
`;

const NewYork = Row.extend`
  background-image: url(${newYorkImg});
  margin-bottom: 10px;
  ${media.minSmall} {
    order: 2;
    height: 190px;
    width: calc(50% - 10px);
    margin-bottom: 0;
  }
  ${media.minMedium} {
    height: 400px;
    width: 0;
    flex: 1;
  }
`;

const SanFrancisco = Row.extend`
  background-image: url(${sanFranciscoImg});
  height: 190px;
  margin-bottom: 10px;
  ${media.minSmall} {
    margin-bottom: 20px;
  }
`;

const London = Row.extend`
  background-image: url(${londonImg});
  height: 190px;
`;

const InnerText = styled.div`
  margin: auto auto 18px 26px;
`;

export default function HomeSectionTopDestinations() {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Top Destinations</h3>
        </SectionHeader>
        <SectionContent>
          <Paris><InnerText>Paris</InnerText></Paris>
          <NewYork><InnerText>New York</InnerText></NewYork>
          <CenterContainer>
            <SanFrancisco><InnerText>San Francisco</InnerText></SanFrancisco>
            <London><InnerText>London</InnerText></London>
          </CenterContainer>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}
