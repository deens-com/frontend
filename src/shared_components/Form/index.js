// NPM
import React, { Component } from 'react';
import styled from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const FormStyle = styled.form`
  display: ${props => props.display || 'block'};
`;

// MODULE
export default class Form extends Component {
  onSubmit(ev) {
    ev.preventDefault();
    if (typeof this.props.onSubmit === 'function') this.props.onSubmit(ev);
  }

  render() {
    return <FormStyle {...this.props}>{this.props.children}</FormStyle>;
  }
}

// Props Validation
Form.propTypes = {};
