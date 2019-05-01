import React, { useState, useEffect } from 'react';
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
import isMatch from 'lodash.ismatch';
import { media } from 'libs/styled';
import { FiltersIcon, BackArrow } from 'shared_components/icons';
import moment from 'moment';
import apiClient from 'libs/apiClient';

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
  svg {
    width: 1.5em !important;
    height: 1.5em !important;
  }
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
  const filters = filtersByType[searchParams.type];

  useEffect(
    () => {
      if (
        (searchParams.city && searchParams.countryCode) ||
        (searchParams.lat && searchParams.lng)
      ) {
        if (searchParams.startDate) {
          const body = {
            adultCount: searchParams.adults || 2,
            childrenCount: searchParams.children || 0,
            infantCount: searchParams.infants || 0,
            location: {
              ...(searchParams.city
                ? {
                    city: searchParams.city,
                    countryCode: searchParams.countryCode,
                  }
                : {
                    lat: searchParams.lat,
                    lng: searchParams.lng,
                  }),
            },
            dates: [moment(searchParams.startDate).format('YYYY-MM-DD')],
          };
          apiClient.services.search.prefetch(body);
        }
      }
    },
    [
      searchParams.adults,
      searchParams.children,
      searchParams.infants,
      searchParams.city,
      searchParams.lat,
      searchParams.lng,
      searchParams.startDate,
    ],
  );

  if (!filters) {
    return null;
  }

  return (
    <Wrapper showingMobile={showingMobile}>
      {backToTrip && (
        <BackToTrip to={`/trips/organize/${backToTrip}`}>
          <BackArrow />
          <P>Back to trip</P>
        </BackToTrip>
      )}

      <FilterIconWrapper showingMobile={showingMobile}>
        <span
          onClick={() => {
            setShowingMobile(!showingMobile);
          }}
        >
          <FiltersIcon />
        </span>
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
          numberOfPeople={(searchParams.adults || 2) + (searchParams.children || 0)}
        />
      )}
      {filters.includes(availableFilters.priceRangeOnlyMax) && (
        <PriceRangeFilter
          onlyMax
          maxPrice={searchParams.priceEnd}
          onApply={search}
          pricePer="per person"
          numberOfPeople={(searchParams.adults || 2) + (searchParams.children || 0)}
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
