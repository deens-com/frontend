import React from 'react';
import styled from 'styled-components';
import GuestsFilter from './Guests';
import { pushSearch } from 'libs/search';

const Wrapper = styled.div`
  flex-grow: 1;
`;

const Filters = ({ searchParams }) => {
  const search = params => {
    pushSearch({
      ...searchParams,
      ...params,
    });
  };
  return (
    <Wrapper>
      <GuestsFilter
        adults={searchParams.adults}
        children={searchParams.children}
        infants={searchParams.infants}
        onApply={search}
      />
    </Wrapper>
  );
};

export default Filters;
