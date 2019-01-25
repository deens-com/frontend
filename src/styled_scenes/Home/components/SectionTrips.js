// NPM
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

// COMPONENTS
import ErrorHandler from 'shared_components/ErrorHandler';
import TripCarousel from './TripCarousel';

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent,
  More,
} from '../../../shared_components/layout/Page';

export default class HomeSectionTrips extends React.Component {
  render() {
    const { isLoading, trips, retryFunction } = this.props;

    return (
      <PageWrapper>
        <SectionWrap>
          <SectionHeader>
            <h3>Featured Customizable Trips</h3>
            <More>
              <Link to="/results?serviceTypes=trip">See All Trips</Link>
            </More>
          </SectionHeader>
          <SectionContent>
            {isLoading ? (
              <Loader active inline="centered" size="big" />
            ) : (
              <ErrorHandler retryFunction={retryFunction}>
                <TripCarousel trips={trips} />
              </ErrorHandler>
            )}
          </SectionContent>
        </SectionWrap>
      </PageWrapper>
    );
  }
}

// Props Validation
HomeSectionTrips.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object),
};
