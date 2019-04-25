import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { pushSearch, filtersByType, availableFilters } from 'libs/search';
import { P } from 'libs/commonStyles';
import { primary, disabled } from 'libs/colors';
import GuestsFilter from './Guests';
import DatesFilter from './Dates';
import PriceRangeFilter from './PriceRange';
import PriceTagsFilter from './PriceTags';
import TagsFilter from './Tags';
import { BackArrow } from 'shared_components/icons';
import isMatch from 'lodash.ismatch';
import { media } from 'libs/styled';
import { FiltersIcon, BackArrow } from 'shared_components/icons';

import 'react-dates.css';

const Wrapper = styled.div`
  flex-grow: 1;
  display: block;
  margin-right: 15px;
  > div:not(:last-child) {
    margin-right: 15px;
  }
  > div {
    display: ${props => (props.showingMobile ? 'inline-block' : 'none')};
    ${media.minSmall} {
      display: inline-block;
    }
    margin-bottom: 10px;
  }
`;

const FilterIconWrapper = styled.span`
  display: block;
  color: ${props => (props.showingMobile ? disabled : primary)};
  align-self: flex-start;
  margin-bottom: 15px;
  ${media.minSmall} {
    display: none;
  }
`;

const BackToTrip = styled(Link)`
  color: ${primary};
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  margin-bottom: 15px;
  margin-right: 15px;
  > p {
    margin-left: 5px;
  }
  ${media.minSmall} {
    margin-bottom: 0;
  }
`;

const Filters = ({ searchParams, backToTrip }) => {
  const [showingMobile, setShowingMobile] = useState(false);
  const search = params => {
    const keepPage = isMatch(searchParams, params);
    pushSearch(
      {
        ...searchParams,
        ...params,
      },
      undefined,
      keepPage ? searchParams.page : undefined,
    );
  };
  const filters = filtersByType[searchParams.type[0]];

  return (
    <Wrapper showingMobile={showingMobile}>
      {backToTrip && (
        <BackToTrip to={`/trips/organize/${backToTrip}`}>
          <BackArrow />
          <P>Back to trip</P>
        </BackToTrip>
      )}

      <FilterIconWrapper
        showingMobile={showingMobile}
        onClick={() => {
          setShowingMobile(!showingMobile);
        }}
      >
        <FiltersIcon />
      </FilterIconWrapper>

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
          numberOfPeople={(searchParams.adults || 1) + (searchParams.children || 0)}
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
