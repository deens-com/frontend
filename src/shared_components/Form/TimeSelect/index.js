// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Select from "react-select";

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  position: relative;
  width: 100%;

  .Select-control {
    padding: 6px 0px 6px 0;
  }
`;

const time = [
  { label: "00:00", value: "0000" },
  { label: "01:00", value: "0100" },
  { label: "02:00", value: "0200" },
  { label: "03:00", value: "0300" },
  { label: "04:00", value: "0400" },
  { label: "05:00", value: "0500" },
  { label: "06:00", value: "0600" },
  { label: "07:00", value: "0700" },
  { label: "08:00", value: "0800" },
  { label: "09:00", value: "0900" },
  { label: "10:00", value: "1000" },
  { label: "11:00", value: "1100" },
  { label: "12:00", value: "1200" },
  { label: "13:00", value: "1300" },
  { label: "14:00", value: "1400" },
  { label: "15:00", value: "1500" },
  { label: "16:00", value: "1600" },
  { label: "17:00", value: "1700" },
  { label: "18:00", value: "1800" },
  { label: "19:00", value: "1900" },
  { label: "20:00", value: "2000" },
  { label: "21:00", value: "2100" },
  { label: "22:00", value: "2200" },
  { label: "23:00", value: "2300" }
];

// MODULE
export default class TimeSelect extends Component {
  constructor() {
    super();
    this.state = {
      focus: false
    };
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onChange(value) {
    if (typeof this.props.onChange === "function") this.props.onChange(value);
  }

  onFocus() {
    this.setState({ focus: true });
    if (typeof this.props.onFocus === "function")
      this.props.onFocus(this.select);
  }

  onBlur(ev) {
    this.setState({ focus: false });
    if (typeof this.props.onBlur === "function") this.props.onBlur();
  }

  render() {
    return (
      <Wrap>
        <Select
          name="time"
          value=""
          placeholder={this.props.placeholder}
          autoBlur={true}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          options={time}
        />
      </Wrap>
    );
  }
}

// Props Validation
TimeSelect.propTypes = {};
