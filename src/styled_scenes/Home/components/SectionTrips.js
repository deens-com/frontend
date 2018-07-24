// NPM
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// COMPONENTS
import Carousel from '../../../shared_components/Carousel';
import LocationCart from '../../../shared_components/Carts/Location';

// ACTIONS/CONFIG

// STYLES
import {
  PageWrapper,
  SectionWrap,
  SectionHeader,
  SectionContent,
  More,
} from '../../../shared_components/layout/Page';

export default function HomeSectionTrips({ trips }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <h3>Amazing Trips</h3>
          <More>
            <Link to="/results?service_types=trip">All trips</Link>
          </More>
        </SectionHeader>
        <SectionContent>
          <Carousel sm_slides_nb={1} md_slides_nb={2} lg_slides_nb={4} xl_slides_nb={4}>
            {trips.map(item => (
              <Link to={'/trips/' + item.objectId} key={item.objectId}>
                <LocationCart item={item} />
              </Link>
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
