// NPM
import React, { Component } from "react";
import styled from "styled-components";
import Select from "../controls/Select";

// ACTIONS/CONFIG

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  .Select-control {
    padding: 6px 0px 6px 0;
  }
`;

// MODULE
const personOptions = [
  { value: "one", label: "1" },
  { value: "two", label: "2" },
  { value: "three", label: "3" },
  { value: "four", label: "4" }
];
export default class PersonInput extends Component {
  constructor() {
    super();
    this.state = {
      focus: false
    };
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(val) {
    if (typeof this.props.onChange === "function") this.props.onChange(val);
  }

  onFocus() {
    this.setState({ focus: true });
    if (typeof this.props.onFocus === "function")
      this.props.onFocus(this.input);
  }

  onBlur(ev) {
    this.setState({ focus: false });
    if (typeof this.props.onBlur === "function") this.props.onBlur();
  }

  render() {
    return (
      <Wrapper>
        <Select
          name="person"
          value=""
          placeholder={this.props.placeholder}
          autoBlur={true}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          options={personOptions}
        />
      </Wrapper>
    );
  }
}

// Props Validation
PersonInput.propTypes = {};
