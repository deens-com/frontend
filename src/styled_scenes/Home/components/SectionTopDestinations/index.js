// NPM
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from 'libs/styled';

import sydneyImg from './images/sydney.jpg';
import sanFranciscoImg from './images/san-francisco.jpg';
import londonImg from './images/london.jpg';
import newYorkImg from './images/new-york.jpg';

// ACTIONS/CONFIG

// STYLES
import { PageWrapper, SectionWrap, SectionHeader } from '../../../../shared_components/layout/Page';

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
  font-size: 36px;
  line-height: 42px;
  font-weight: bold;
  flex: 1;

  ${media.minSmall} {
    margin: 0;
    width: auto;
  }
`;

const FlexLink = styled(Link)`
  flex: 1;
  ${media.minSmall} {
    margin-bottom: 20px;
    height: 190px;
    width: calc(50% - 10px);
  }
`;

const NewYorkLink = FlexLink.extend`
  ${media.minSmall} {
    margin-bottom: 0;
    order: 2;
  }
`;

const SFLink = styled(Link)`
  margin-bottom: 10px;
  ${media.minSmall} {
    margin-bottom: 20px;
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

const Sydney = Row.extend`
  background-image: url(${sydneyImg});
  flex: 1;
  margin-bottom: 10px;
  ${media.minSmall} {
    height: 190px;
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
    height: 190px;
    margin-bottom: 0;
  }
  ${media.minMedium} {
    height: 400px;
    width: auto;
    flex: 1;
  }
`;

const SanFrancisco = Row.extend`
  background-image: url(${sanFranciscoImg});
  height: 190px;
`;

const London = Row.extend`
  background-image: url(${londonImg});
  height: 190px;
`;

const InnerText = styled.div`
  margin: auto auto 18px 26px;
  color: white;
`;

const sydneyParams =
  'latitude=-33.8688197&longitude=151.20929550000005&address=Sydney%20NSW,%20Australia';
const newYorkParams = 'latitude=40.7127753&longitude=-74.0059728&address=New%20York,%20NY,%20USA';
const londonParams = 'latitude=51.5073509&longitude=-0.12775829999998223&address=London,%20UK';
const sanFranciscoParams =
  'latitude=37.7749295&longitude=-122.41941550000001&address=San%20Francisco,%20CA,%20USA';

export default function HomeSectionTopDestinations() {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Top Destinations</h3>
        </SectionHeader>
        <SectionContent>
          <FlexLink to={`/results?${sydneyParams}`}>
            <Sydney>
              <InnerText>Sydney</InnerText>
            </Sydney>
          </FlexLink>
          <NewYorkLink to={`/results?${newYorkParams}`}>
            <NewYork>
              <InnerText>New York</InnerText>
            </NewYork>
          </NewYorkLink>
          <CenterContainer>
            <SFLink to={`/results?${sanFranciscoParams}`}>
              <SanFrancisco>
                <InnerText>San Francisco</InnerText>
              </SanFrancisco>
            </SFLink>
            <Link to={`/results?${londonParams}`}>
              <London>
                <InnerText>London</InnerText>
              </London>
            </Link>
          </CenterContainer>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}
