// NPM
import React from 'react';
import Select from 'react-select';
import './styles.css';
// import dropArrow from './dropArrow.svg';

// COMPONENTS

// ACTIONS/CONFIG

// MODULE
export default function SelectWrap(props) {
  return <Select clearable={false} searchable={false} {...props} />;
}

// Props Validation
SelectWrap.propTypes = {};
