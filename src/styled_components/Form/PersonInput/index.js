// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import { PlusIcon, MinusIcon } from './icons';

// ACTIONS/CONFIG

// STYLES
import { InputControl } from '../controls/styles';
import { Wrapper, Overlay, Button, Value } from './styles';

const DisplayValue = styled.span`
  display: block;
  outline: none;
`;

const Placeholder = styled.span`
  display: inline-block;
  color: #99a9be;
`;

// MODULE
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

  onChange(ev) {
    if (typeof this.props.onChange === 'function') this.props.onChange(ev.target.value);
  }

  onFocus() {
    this.setState({ focus: true });
    if (typeof this.props.onFocus === 'function') this.props.onFocus(this.input);
  }

  onBlur(ev) {
    if (!ev.currentTarget.contains(ev.relatedTarget) && this.state.focus) {
      this.setState({ focus: false });
      if (typeof this.props.onBlur === 'function') this.props.onBlur();
    }
  }

  render() {
    return (
      <Wrapper>
        {this.props.value === null && !this.props.focused ? (
          <Placeholder>Persons</Placeholder>
        ) : (
          <DisplayValue
            tabIndex="0"
            innerRef={value => {
              this.dispaly = value;
              this.props.innerRef(value);
            }}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          >
            {this.props.value || '1'}
          </DisplayValue>
        )}
        {this.props.focused && (
          <Overlay>
            <div
              onClick={ev => {
                console.log('target', ev.target);
              }}
            >
              <Button onClick={this.handleDecrement}>
                <MinusIcon />
              </Button>
              <Value>{this.props.value || 1}</Value>
              <Button onClick={this.handleIncrement}>
                <PlusIcon />
              </Button>
            </div>
          </Overlay>
        )}
      </Wrapper>
    );
  }
}

// Props Validation
PersonInput.propTypes = {};
