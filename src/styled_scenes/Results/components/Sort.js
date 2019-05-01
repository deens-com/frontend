import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Popup } from 'semantic-ui-react';
import { P } from 'libs/commonStyles';
import { disabled, primary } from 'libs/colors';

const options = ['relevance:desc', 'rating:desc', 'price:desc', 'price:asc'];
const tripOptions = options;
const accommodationOptions = options;
const foodOptions = ['relevance:desc'];
const activityOptions = ['relevance:desc', 'price:desc', 'price:asc'];

const SortBy = styled(P)`
  float: right;
  margin-right: 15px;
  cursor: pointer;
  > span {
    color: ${primary};
  }
`;

const PopupContent = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  > li {
    cursor: pointer;
    margin-bottom: 5px;
    font-size: 14px;
    &:hover {
      background-color: ${disabled};
    }
  }
`;

function sortByToComponent(by) {
  switch (by) {
    case 'rating:desc':
      return <span key={by}>Rating</span>;
    case 'price:desc':
      return <span key={by}>↓ Price</span>;
    case 'price:asc':
      return <span key={by}>↑ Price</span>;
    default:
      return <span key={by}>Relevance</span>;
  }
}

const getValidOptions = type => {
  switch (type) {
    case 'trip':
      return tripOptions;
    case 'accommodation':
      return accommodationOptions;
    case 'food':
      return foodOptions;
    case 'activity':
      return activityOptions;
    default:
      return options;
  }
};

const Sort = ({ searchParams, updateSearchParams }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectSorting = sortBy => {
    setIsOpen(false);
    updateSearchParams({ ...searchParams, sortBy });
  };

  const validOptions = getValidOptions(searchParams.type);

  return (
    <Popup
      trigger={<SortBy>Sort by {sortByToComponent(searchParams.sortBy)}</SortBy>}
      on="click"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      position="bottom center"
    >
      <PopupContent>
        {validOptions.map(item => (
          <li onClick={() => selectSorting(item)}>{sortByToComponent(item)}</li>
        ))}
      </PopupContent>
    </Popup>
  );
};

Sort.propTypes = {
  by: PropTypes.oneOf(options),
};

Sort.defaultProps = {
  by: 'relevance:desc',
};

export default Sort;
