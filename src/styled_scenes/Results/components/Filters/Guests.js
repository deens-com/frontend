import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'shared_components/Dropdown';
import GuestsSelector from 'shared_components/SelectGuests/GuestsSelector';

const Guests = ({ adults, children, infants, onApply }) => {
  const guests = adults + children + infants || 1;
  return (
    <Dropdown trigger={`${guests} Guest${guests > 1 ? 's' : ''}`}>
      <GuestsSelector
        adults={adults}
        children={children}
        infants={infants}
        onApply={onApply}
        relative
      />
    </Dropdown>
  );
};

Guests.propTypes = {
  onApply: PropTypes.func.isRequired,
  adults: PropTypes.number,
  children: PropTypes.number,
  infants: PropTypes.number,
};

Guests.defaultProps = {
  adults: 1,
  children: 0,
  infants: 0,
};

export default Guests;
