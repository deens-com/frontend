// NPM
import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import './styles.css';

// COMPONENTS

// ACTIONS/CONFIG

// MODULE
export default function DateInput(props) {
  return (
    <DayPickerInput
      ref={item => {
        item && props.innerRef(item.input);
      }}
      inputProps={{
        onBlur: props.onBlur,
        onFocus: props.onFocus
      }}
      placeholder={props.placeholder}
      value={props.value}
      onDayChange={props.onChange}
    />
  );
}

// Props Validation
DateInput.propTypes = {};
