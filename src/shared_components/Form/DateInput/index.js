// NPM
import React from 'react';
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
      {...props}
    />
  );
}

// Props Validation
DateInput.propTypes = {};
