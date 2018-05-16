// NPM
import React from "react";
import Select from "react-select";
import "./styles.css";
// import dropArrow from './dropArrow.svg';

// COMPONENTS

// ACTIONS/CONFIG

// MODULE
export default function SelectWrap({
  name,
  autoBlur,
  onChange,
  value,
  placeholder,
  options,
  onBlur,
  onFocus
}) {
  return (
    <Select
      name={name}
      autoBlur={autoBlur}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      onBlur={onBlur}
      onFocus={onFocus}
      clearable={false}
      searchable={false}
    />
  );
}

// Props Validation
SelectWrap.propTypes = {};
