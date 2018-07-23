// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import Select from '../controls/Select';

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
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
];
export default class PersonInput extends Component {
  constructor() {
    super();
    this.state = {
      focus: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(val) {
    if (typeof this.props.onChange === 'function') this.props.onChange(val);
  }

  onFocus() {
    this.setState({ focus: true });
    if (typeof this.props.onFocus === 'function') this.props.onFocus(this.input);
  }

  onBlur(ev) {
    this.setState({ focus: false });
    if (typeof this.props.onBlur === 'function') this.props.onBlur();
  }

  render() {
    return (
      <Wrapper>
        <Select
          name="person"
          {...this.props}
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
