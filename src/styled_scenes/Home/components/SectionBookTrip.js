// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { H3, P } from 'libs/commonStyles';
import { secondaryContrast, secondary, lightText } from 'libs/colors';
import Search from './HomeSearch';
import map from '../images/findATripMap.svg';
import customizeIcon from '../images/customizeTrip.svg';
import bookIcon from '../images/bookTrip.svg';
import { media } from 'libs/styled';

// STYLES
import { PageWrapper } from '../../../shared_components/layout/Page';

const Section = styled.section`
  background-color: ${secondaryContrast};
  padding-bottom: 25px;
  ${media.minSmall} {
    margin-top: 0;
    padding-top: 25px;
  }
  text-align: center;
  margin-bottom: 40px;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 25px;
  flex-direction: column;
  align-items: center;
  ${media.minSmall} {
    flex-direction: row;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 350px;
  > img {
    margin-top: 20px;
    ${media.minSmall} {
      margin-top: 0;
    }
  }
  ${media.minSmall} {
    &:first-child {
      margin-right: 30px;
    }
    &:last-child {
      margin-left: 30px;
    }
  }
`;

const Title = styled(H3)`
  color: ${secondary};
  margin-top: 15px;
  ${media.minSmall} {
    margin-top: 25px;
  }
`;

const Paragraph = styled(P)`
  color: ${lightText};
  margin-bottom: 25px;
  ${media.minSmall} {
    margin-bottom: 0;
  }
`;

export default class SectionBookTrip extends React.Component {
  render() {
    return (
      <Section>
        <PageWrapper>
          <Content>
            <Column>
              <img src={map} alt="Find a Trip" />
              <Title>Find a Trip</Title>
              <Paragraph>
                Locals have created hundreds of trips sorted by flavour to please every traveler
              </Paragraph>
            </Column>
            <Column>
              <img src={customizeIcon} alt="Customize your Trip" />
              <Title>Customize your Trip</Title>
              <Paragraph>
                It’s <strong>your trip</strong> so if you don’t like something, just remove it, and
                if you want to add a walk in the park, you can do it!
              </Paragraph>
            </Column>
            <Column>
              <img src={bookIcon} alt="Book your Trip" />
              <Title>Book your Trip</Title>
              <Paragraph>
                Easily book the services we support or we give you the links to book directly on the
                correct websites
              </Paragraph>
            </Column>
          </Content>
          <Search />
        </PageWrapper>
      </Section>
    );
  }
}

// Props Validation
SectionBookTrip.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object),
};
