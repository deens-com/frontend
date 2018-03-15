// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import Select from 'react-select';
// import './styles.css';
import dropArrow from '../../../icons/dropArrow.svg';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES

const Wrap = styled.div`
  position: relative;

  &:after {
    right: 0;
    top: 50%;
    content: '';
    background: url(${dropArrow});
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    transform: translateY(-50%);
  }
`;

const SelectControl = styled.select`
  position: relative;
  display: block;
  font-size: inherit;
  font-family: inherit;
  font-style: inherit;
  font-weight: inherit;
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  -webkit-appearance: none;
  cursor: pointer;
  padding-right: 16px;
  color: ${props => (props.theme === 'light' ? '#fff' : 'inherit')};
`;

// MODULE
export default class Select extends Component {
  constructor() {
    super();
    this.state = {
      focus: false
    };
  }
  render() {
    const { onChange, value, placeholder, optionList, theme } = this.props;
    return (
      <Wrap>
        <SelectControl onChange={onChange} theme={theme} focus={this.state.focus}>
          {optionList.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectControl>
      </Wrap>
    );
  }
}

// Props Validation
Select.propTypes = {};
