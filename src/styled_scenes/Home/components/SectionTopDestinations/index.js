// NPM
import React from 'react';
import styled from 'styled-components';

import { media } from 'libs/styled';
import { H1, H2 } from 'libs/commonStyles';

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

const FlexLink = styled.div`
  flex: 1;
  cursor: pointer;
  ${media.minSmall} {
    margin-bottom: 20px;
    height: 190px;
    width: calc(50% - 10px);
  }
`;

const NewYorkLink = styled(FlexLink)`
  ${media.minSmall} {
    margin-bottom: 0;
    order: 2;
  }
`;

const LondonLink = styled.div`
  cursor: pointer;
`;

const SFLink = styled.div`
  cursor: pointer;
  margin-bottom: 10px;
  ${media.minSmall} {
    margin-bottom: 20px;
  }
`;

const CenterContainer = styled(Column)`
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

const Sydney = styled(Row)`
  background-image: url(https://please-com.imgix.net/big-sydney.jpg?auto=compress);
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

const NewYork = styled(Row)`
  background-image: url(https://please-com.imgix.net/big-new-york.jpg?auto=compress);
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

const SanFrancisco = styled(Row)`
  background-image: url(https://please-com.imgix.net/small-san-francisco.jpg?auto=compress);
  height: 190px;
`;

const London = styled(Row)`
  background-image: url(https://please-com.imgix.net/small-london.jpg?auto=compress);
  height: 190px;
`;

const InnerText = styled(H1)`
  margin: auto auto 18px 26px !important;
  color: white;
`;

const sydneyParams = {
  type: 'trip',
  address: 'Sydney, Australia',
  city: 'Sydney',
  state: 'New South Wales',
  countryCode: 'AU',
};

const newYorkParams = {
  type: 'trip',
  address: 'New York, NY, USA',
  city: 'New York',
  state: 'New York',
  countryCode: 'US',
};

const londonParams = {
  type: 'trip',
  address: 'London, UK',
  city: 'London',
  state: 'England',
  countryCode: 'GB',
};

const sanFranciscoParams = {
  type: 'trip',
  address: 'San Francisco, CA, USA',
  city: 'San Francisco',
  state: 'California',
  countryCode: 'US',
};

export default function HomeSectionTopDestinations({ updateSearchParams }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <H2>Top Destinations</H2>
        </SectionHeader>
        <SectionContent>
          <FlexLink
            onClick={() => {
              updateSearchParams(sydneyParams);
            }}
          >
            <Sydney>
              <InnerText>Sydney</InnerText>
            </Sydney>
          </FlexLink>
          <NewYorkLink
            onClick={() => {
              updateSearchParams(newYorkParams);
            }}
          >
            <NewYork>
              <InnerText>New York</InnerText>
            </NewYork>
          </NewYorkLink>
          <CenterContainer>
            <SFLink
              onClick={() => {
                updateSearchParams(sanFranciscoParams);
              }}
            >
              <SanFrancisco>
                <InnerText>San Francisco</InnerText>
              </SanFrancisco>
            </SFLink>
            <LondonLink
              onClick={() => {
                updateSearchParams(londonParams);
              }}
            >
              <London>
                <InnerText>London</InnerText>
              </London>
            </LondonLink>
          </CenterContainer>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}
