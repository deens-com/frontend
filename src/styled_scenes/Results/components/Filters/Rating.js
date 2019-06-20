import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dropdown from 'shared_components/Dropdown';
import Star from 'shared_components/icons/Star';
import { primary, disabled, primaryHover } from 'libs/colors';

const Content = styled.div`
  display: flex;
  padding: 10px;
  > *:not(:last-child) {
    margin-right: 6px;
  }
  svg {
    cursor: pointer;
    &:hover {
      color: ${primaryHover} !important;
    }
  }
`;

function getStyle(current, start, end) {
  if (current >= start && current <= end) {
    return {
      color: primary,
    };
  }
  return {
    color: disabled,
  };
}

const Rating = ({ ratingStart, ratingEnd, onApply }) => {
  const [selectedStart, setSelectedStart] = useState(undefined);
  const [selectedEnd, setSelectedEnd] = useState(undefined);
  const [hoveredEnd, setHoveredEnd] = useState(undefined);
  const [isOpen, setOpen] = useState(false);

  const onSelect = star => {
    if (!selectedStart) {
      setSelectedStart(star);
      return;
    }
    setSelectedEnd(star);
    setOpen(false);
  };

  const onClose = () => {
    onApply({
      ratingStart: selectedStart,
      ratingEnd: selectedEnd,
    });

    setHoveredEnd(undefined);
    setSelectedEnd(undefined);
    setSelectedStart(undefined);
    setOpen(false);
  };

  const onMouseOver = star => {
    if (selectedStart) {
      setHoveredEnd(star);
    }
  };

  return (
    <Dropdown
      onOpen={() => setOpen(true)}
      open={isOpen}
      onClose={onClose}
      trigger={`${ratingStart} - ${ratingEnd} stars`}
    >
      <Content>
        {[...new Array(5)].map((_, i) => (
          <span
            key={i}
            onMouseOver={() => onMouseOver(i + 1)}
            onClick={() => onSelect(i + 1)}
            style={getStyle(
              i + 1,
              selectedStart || ratingStart,
              selectedStart ? hoveredEnd : ratingEnd,
            )}
          >
            <Star />
          </span>
        ))}
      </Content>
    </Dropdown>
  );
};

Rating.propTypes = {
  onApply: PropTypes.func.isRequired,
  ratingStart: PropTypes.number,
  ratingEnd: PropTypes.number,
};

Rating.defaultProps = {
  ratingStart: 1,
  ratingEnd: 5,
};

export default Rating;
