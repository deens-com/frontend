// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { H2, H3 } from 'libs/commonStyles';
import { media } from 'libs/styled';

// COMPONENTS
import ErrorHandler from 'shared_components/ErrorHandler';
import TripCarousel from './TripCarousel';

// ACTIONS/CONFIG

// STYLES
import { PageWrapper, SectionWrap, SectionContent } from '../../../shared_components/layout/Page';

// i18n
import { Trans } from '@lingui/macro';

const Subtitle = styled(H3)`
  font-weight: lighter;
  margin-top: 0;
  display: none;
  ${media.minSmall} {
    display: block;
  }
`;

const SubtitleMobile = styled(H3)`
  font-weight: lighter;
  margin-top: 0;
  ${media.minSmall} {
    display: none;
  }
`;

const SectionHeader = styled.header`
  margin-bottom: 20px;
`;

export default class HomeSectionTrips extends React.PureComponent {
  render() {
    const { isLoading, trips, retryFunction } = this.props;

    return (
      <React.Fragment>
        <PageWrapper>
          <SectionWrap>
            <SectionHeader>
              <H2>
                <Trans>Featured Trips</Trans>
              </H2>
              <Subtitle>
                <Trans>
                  Explore the best trips created by locals. They are{' '}
                  <strong>100% customizable</strong> and <strong>we don’t charge you extra!</strong>
                </Trans>
              </Subtitle>
              <SubtitleMobile>
                <Trans>100% customizable trips created by locals</Trans>
              </SubtitleMobile>
            </SectionHeader>
          </SectionWrap>
        </PageWrapper>
        <PageWrapper>
          <SectionWrap>
            <SectionContent>
              <ErrorHandler retryFunction={retryFunction}>
                <TripCarousel trips={trips} isLoading={isLoading} />
              </ErrorHandler>
            </SectionContent>
          </SectionWrap>
        </PageWrapper>
      </React.Fragment>
    );
  }
}

// Props Validation
HomeSectionTrips.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object),
};
