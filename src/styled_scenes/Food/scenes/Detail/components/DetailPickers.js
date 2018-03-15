// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import FlatControl from '../../../../../components/Form/FlatControl';

// ACTIONS/CONFIG

// STYLES

const Wrap = styled.div`
  display: flex;
  background: white;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  padding: 10px;

  & > div {
    border: none;
    flex: 1;

    &:after {
      content: '';
      width: 1px;
      height: 60%;
      background: #eef1f4;
      position: absolute;
      right: 10px;
      top: 20%;
    }

    &:last-child {
      &:after {
        display: none;
      }
    }
  }
`;

// MODULE
export default class FoodDetailPickers extends Component {
  constructor() {
    super();
    this.state = {
      date: null,
      time: null,
      person: null
    };
  }
  render() {
    return (
      <Wrap>
        <FlatControl
          onChange={value => {
            console.log(value);
          }}
          value={this.state.date}
          type="date"
          placeholder="Pick the date"
          leftIcon="date"
        />
        <FlatControl
          onChange={value => {
            console.log(value);
          }}
          value={this.state.time}
          type="time"
          placeholder="Pick the time"
          leftIcon="date"
        />
        <FlatControl
          onChange={value => {
            console.log(value);
          }}
          value={this.state.person}
          type="person"
          placeholder="1"
          leftIcon="person"
        />
      </Wrap>
    );
  }
}

// Props Validation
FoodDetailPickers.propTypes = {};
