// NPM
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// COMPONENTS
import Carousel from '../../../shared_components/Carousel';
import LocationCart from '../../../shared_components/Carts/Trip';

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent,
  More,
} from '../../../shared_components/layout/Page';

const Center = styled.div`
  text-align: center;
`;

export default function HomeSectionTrips({ trips }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Featured Trips</h3>
          <More>
            <Link to="/results?service_types=trip">See All Trips</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={3} xl_slides_nb={4}>
            {trips.map(item => (
              <Center>
                <Link to={'/trips/' + item._id} key={item._id}>
                  <LocationCart item={item} />
                </Link>
              </Center>
            ))}
          </Carousel>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}

// Props Validation
HomeSectionTrips.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object),
};
