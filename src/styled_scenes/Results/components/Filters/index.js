import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { pushSearch, filtersByType, availableFilters } from 'libs/search';
import { P } from 'libs/commonStyles';
import { primary } from 'libs/colors';
import GuestsFilter from './Guests';
import DatesFilter from './Dates';
import PriceRangeFilter from './PriceRange';
import PriceTagsFilter from './PriceTags';
import TagsFilter from './Tags';
import { BackArrow } from 'shared_components/icons';
import 'react-dates.css';

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  > div:not(:first-child) {
    margin-left: 15px;
  }
`;

const BackToTrip = styled(Link)`
  color: ${primary};
  cursor: pointer;
  margin-left: 20px;
  display: inline-flex;
  align-items: center;
  > p {
    margin-left: 5px;
  }
`;

const Filters = ({ searchParams, backToTrip }) => {
  const search = params => {
    pushSearch({
      ...searchParams,
      ...params,
    });
  };
  const filters = filtersByType[searchParams.type[0]];

  return (
    <Wrapper>
      {backToTrip && (
        <BackToTrip to={`/trips/organize/${backToTrip}`}>
          <BackArrow />
          <P>Back to trip</P>
        </BackToTrip>
      )}
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
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
          onDateSelect={search}
        />
      )}
      {filters.includes(availableFilters.singleDate) && (
        <DatesFilter
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
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
          selectedTags={searchParams.tags && searchParams.tags.map(tag => ({ value: tag }))}
          onApply={search}
        />
      )}
    </Wrapper>
  );
};

export default Filters;
