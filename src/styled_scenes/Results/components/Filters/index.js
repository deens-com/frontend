import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { filtersByType, availableFilters } from 'libs/search';
import { P } from 'libs/commonStyles';
import { primary, disabled } from 'libs/colors';
import GuestsFilter from './Guests';
import DatesFilter from './Dates';
import PriceRangeFilter from './PriceRange';
import PriceTagsFilter from './PriceTags';
import TagsFilter from './Tags';
import DurationFilter from './Duration';
import RatingFilter from './Rating';
import StarsFilter from './Stars';
import TextFilter from './Text';
import { isEqual } from 'lodash';
import { media } from 'libs/styled';
import FiltersIcon from 'shared_components/icons/FiltersIcon';
import BackArrow from 'shared_components/icons/BackArrow';
import urls from 'libs/urlGenerator';

import 'react-dates.css';

// i18n
import { Trans, t } from '@lingui/macro';

const Wrapper = styled.div`
  flex-grow: 1;
  display: block;
  margin-right: 15px;
  margin-top: -10px;
  > div:not(:last-child) {
    margin-right: 15px;
  }
  > div {
    display: ${props => (props.showingMobile ? 'inline-block' : 'none')};
    ${media.minSmall} {
      display: inline-block;
    }
    margin-top: 10px;
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

const Filters = ({
  searchParams,
  backToTrip,
  minPossiblePrice,
  maxPossiblePrice,
  updateSearchParams,
  onMobileToggle,
  availableAmenities,
  allAmenities,
}) => {
  const [showingMobile, setShowingMobile] = useState(false);
  const search = params => {
    const keepPage = !Object.keys(params).some(key => !isEqual(searchParams[key], params[key]));

    if (keepPage && (!searchParams.page || searchParams.page === 1)) {
      return;
    }

    updateSearchParams(
      {
        ...searchParams,
        ...params,
      },
      { customPage: keepPage ? searchParams.page : undefined },
    );
  };
  const [showOnlyText, setShowOnlyText] = useState(false);
  const filters = showOnlyText ? [availableFilters.text] : filtersByType[searchParams.type];

  if (!filters) {
    return null;
  }

  const handleMobileToggle = () => {
    const newValue = !showingMobile;
    if (onMobileToggle) {
      onMobileToggle(newValue);
    }
    setShowingMobile(newValue);
  };

  return (
    <Wrapper showingMobile={showingMobile}>
      {backToTrip && (
        <BackToTrip to={urls.trip.organize(backToTrip)}>
          <BackArrow />
          <P>
            <Trans>Back to trip</Trans>
          </P>
        </BackToTrip>
      )}

      <FilterIconWrapper showingMobile={showingMobile}>
        <span onClick={handleMobileToggle}>
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
      {filters.includes(availableFilters.priceRange) &&
        minPossiblePrice !== maxPossiblePrice && (
          <PriceRangeFilter
            minPrice={searchParams.priceStart}
            maxPrice={searchParams.priceEnd}
            minPossiblePrice={minPossiblePrice}
            maxPossiblePrice={maxPossiblePrice}
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
      {filters.includes(availableFilters.amenities) &&
        allAmenities && (
          <TagsFilter
            selectedTags={
              searchParams.accommodationAmenities &&
              searchParams.accommodationAmenities.map(amenityId => allAmenities[amenityId])
            }
            customSuggestedTags={availableAmenities}
            onApply={search}
            isAmenitiesFilter
          />
        )}
      {filters.includes(availableFilters.stars) && (
        <StarsFilter accommodationStars={searchParams.accommodationStars} onApply={search} />
      )}
      {filters.includes(availableFilters.rating) && (
        <RatingFilter
          ratingStart={searchParams.ratingStart}
          ratingEnd={searchParams.ratingEnd}
          onApply={search}
        />
      )}
      {filters.includes(availableFilters.duration) && (
        <DurationFilter duration={searchParams.duration} onApply={search} />
      )}
      {filters.includes(availableFilters.text) && (
        <TextFilter
          text={searchParams.text}
          onApply={search}
          onChange={setShowOnlyText}
          big={showOnlyText}
        />
      )}
    </Wrapper>
  );
};

export default Filters;
