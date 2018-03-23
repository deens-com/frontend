// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import FormControl from "../../../../../components/Form/FormControl";

// ACTIONS/CONFIG
import { media } from "../../../../../libs/styled";

// STYLES

const Wrap = styled.div`
  background: white;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  padding: 10px;
  margin-bottom: 50px;

  ${media.minSmall} {
    display: flex;
  }

  ${media.minMedium} {
    margin-bottom: 0;
    margin-right: 25px;
  }

  ${media.minLarge} {
    margin-bottom: 25px;
  }

  ${media.minLargePlus} {
    margin-bottom: 0;
  }

  & > div {
    border: none;
    flex: 1;
    min-width: 143px;
    display: flex;
    align-items: center;

    & > div {
      width: 100%;
    }

    ${media.minMedium} {
      &:after {
        content: "";
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
        <FormControl
          onChange={value => {
            console.log(value);
          }}
          value={this.state.date}
          type="date"
          placeholder="Pick the date"
          leftIcon="date"
        />
        <FormControl
          onChange={value => {
            console.log(value);
          }}
          value={this.state.time}
          type="time"
          placeholder="Pick the time"
          leftIcon="date"
        />
        <FormControl
          onChange={value => {
            console.log(value);
          }}
          value={this.state.person}
          type="person"
          placeholder="Person"
          leftIcon="person"
        />
      </Wrap>
    );
  }
}

// Props Validation
FoodDetailPickers.propTypes = {};
