// NPM
import React, { Suspense } from 'react';
import { PageContent } from 'shared_components/layout/Page';
import SectionTrips from 'styled_scenes/Home/components/SectionTrips';
import FeaturedTripCreator from 'styled_scenes/Home/components/FeaturedTripCreator';
import SectionTopDestinations from 'styled_scenes/Home/components/SectionTopDestinations';

export default ({ retryFunction, trips, isLoading, updateSearchParams }) => (
  <PageContent
    itemProp="itemList"
    itemScope
    itemType="http://schema.org/ItemList"
    padding="28px 0 0"
  >
    <SectionTopDestinations updateSearchParams={updateSearchParams} />
    <SectionTrips retryFunction={retryFunction} trips={trips} isLoading={isLoading} />
    <FeaturedTripCreator />
  </PageContent>
);
