import React from 'react';
import styled from 'styled-components';
import { pushSearch, filtersByType, availableFilters } from 'libs/search';
import GuestsFilter from './Guests';
import DatesFilter from './Dates';
import PriceRangeFilter from './PriceRange';
import PriceTagsFilter from './PriceTags';
import TagsFilter from './Tags';
import 'react-dates.css';

const Wrapper = styled.div`
  flex-grow: 1;
  > div:not(:first-child) {
    margin-left: 15px;
  }
`;

const Filters = ({ searchParams }) => {
  const search = params => {
    pushSearch({
      ...searchParams,
      ...params,
    });
  };
  const filters = filtersByType[searchParams.type[0]];

  return (
    <Wrapper>
      {filters.includes(availableFilters.guests) && (
        <GuestsFilter
          adults={searchParams.adults}
          children={searchParams.children}
          infants={searchParams.infants}
          onApply={search}
        />
      )}
      {filters.includes(availableFilters.dates) && (
        <DatesFilter
          startDate={searchParams.start_date}
          endDate={searchParams.end_date}
          onDateSelect={search}
        />
      )}
      {filters.includes(availableFilters.singleDate) && (
        <DatesFilter
          startDate={searchParams.start_date}
          endDate={searchParams.end_date}
          onDateSelect={search}
          isSingle
        />
      )}
      {filters.includes(availableFilters.priceRange) && (
        <PriceRangeFilter
          minPrice={searchParams.priceStart}
          maxPrice={searchParams.priceEnd}
          onApply={search}
          pricePer={searchParams.type[0] === 'activity' ? 'per person' : undefined}
        />
      )}
      {filters.includes(availableFilters.priceTags) && (
        <PriceTagsFilter priceTags={searchParams.priceLevel} onApply={search} />
      )}
      {filters.includes(availableFilters.tags) && (
        <TagsFilter
          selectedTags={searchParams.tags.map(tag => ({ value: tag }))}
          onApply={search}
        />
      )}
    </Wrapper>
  );
};

export default Filters;
