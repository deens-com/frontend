// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
import { InputControl } from './styles';

// MODULE
export default class Input extends Component {
  constructor() {
    super();
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(ev) {
    if (typeof this.props.onChange === 'function') this.props.onChange(ev.target.value);
  }

  onFocus() {
    if (typeof this.props.onFocus === 'function') this.props.onFocus(this.input);
  }

  onBlur() {
    if (typeof this.props.onBlur === 'function') this.props.onBlur();
  }

  render() {
    let input;

    switch (this.props.type) {
      case 'text': {
        input = (
          <InputControl
            {...this.props}
            type="text"
            innerRef={input => {
              this.input = input;
              this.props.innerRef(input);
            }}
            id={this.props.id}
            readOnly={this.props.readOnly}
            name={this.props.name}
            value={this.props.value}
            placeholder={this.props.placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
          />
        );
        break;
      }
      case 'number': {
        input = (
          <InputControl
            {...this.props}
            type="number"
            innerRef={input => {
              this.input = input;
              this.props.innerRef(input);
            }}
            id={this.props.id}
            readOnly={this.props.readOnly}
            name={this.props.name}
            value={this.props.value}
            placeholder={this.props.placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            step={this.props.step}
            min={this.props.min}
            max={this.props.max}
          />
        );
        break;
      }
      default:
        input = <span>Not specified type</span>;
        break;
    }

    return input;
  }
}

// Props Validation
Input.propTypes = {
  name: PropTypes.string,
};
