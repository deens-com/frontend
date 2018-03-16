// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
// import DayPickerInput from 'react-day-picker/DayPickerInput';

// COMPONENTS
import arrow from './img/arrow.svg';

import FormLabel from './../Form/controls/Label'
// ACTIONS/CONFIG

// STYLES
const FormGroup = styled.div`
  margin: 20px 0;
  width: 100%;

  ${props =>
    props.last &&
    css`
      margin-bottom: 30px;
    `};
`;

const Input = styled.input`
  display: block;
  font-family: inherit;
  font-size: inherit;
  border-radius: 3px;
  background: none;
  padding: 13px 10px 15px 20px;
  color: #374859;
  width: 100%;
  border: 0;
  max-width: 100%;
  letter-spacing: 0.03em;
  outline: none;
  appearance: none;
  transition: border-color 0.1s ease-in-out;
`;

const TextareaInput = Input.withComponent('textarea');

const Select = Input.withComponent('select');
const SelectInput = Select.extend`
  cursor: pointer;
  background-image: url(${arrow});
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 13px 8px;
`;

const InnerWrapper = styled.div`
  display: flex;
  background-color: #fff;
  box-shadow: 0 6px 10px 0 rgba(202, 215, 223, 0.4);
  border: 1px solid #fff;
  cursor: text;
  transition: border-color 0.1s ease-out;
  border-radius: 4px;

  ${props =>
    props.focus
      ? css`
          border-color: #6751c8;
        `
      : css`
          &:hover {
            border-color: #beb2e0;
          }
        `};
`;

const InnerLeftIcon = styled.div`
  display: flex;
  width: 50px;
  margin: -1px 0;
  padding-bottom: 2px;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #dce0e4;
`;

const InnerRightIcon = styled.div`
  display: flex;
  width: 50px;
  margin: -1px 0;
  padding-bottom: 2px;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #dce0e4;
`;

const InnerInput = styled.div`
  flex-grow: 1;
  max-width: 100%;
`;

const FormError = styled.span`
  color: #ff6060;
  font-size: 12px;
  margin-top: 15px;
  display: block;
  text-align: left;
  padding: 0 20px;
`;

const FileInput = styled.input`
  padding: 16px 10px 16px 20px;
  width: 100%;
  cursor: pointer;
`;

// MODULE
const settings = { firstDayOfWeek: 1 };

export default class FormControl extends Component {
  constructor(props) {
    super(props);

    this.input = null;

    let value = props.value;
    if (typeof value === 'undefined') {
      value = '';
    }

    this.state = {
      focus: false,
      value,
      error: null
    };

    this.focus = this.focus.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value && typeof nextProps.value !== 'undefined') {
      this.setState({
        value: nextProps.value
      });
    }
  }

  focus() {
    if (this.input !== null) {
      this.input.focus();
    }
  }

  onFocus() {
    this.setState({ focus: true });
  }

  onBlur() {
    this.setState({ focus: false });
  }

  onChange(ev) {
    if (typeof ev.target.value !== 'undefined') {
      this.setState({ value: ev.target.value });
    }

    if (typeof this.props.onChange === 'function') this.props.onChange(ev.target.value);
  }

  render() {
    let label = null;
    if (this.props.label) {
      label = <FormLabel htmlFor={this.props.id}>{this.props.label}</FormLabel>;
    }

    let input;
    switch (this.props.type) {
      case 'number': {
        input = (
          <Input
            innerRef={input => {
              this.input = input;
            }}
            id={this.props.id}
            readOnly={this.props.readOnly}
            name={this.props.id}
            value={this.state.value}
            placeholder={this.props.placeholder}
            type="number"
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

      case 'text': {
        input = (
          <Input
            innerRef={input => {
              this.input = input;
            }}
            id={this.props.id}
            readOnly={this.props.readOnly}
            name={this.props.id}
            value={this.state.value}
            placeholder={this.props.placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            type="text"
          />
        );
        break;
      }

      case 'textarea': {
        input = (
          <TextareaInput
            innerRef={input => {
              this.input = input;
            }}
            id={this.props.id}
            readOnly={this.props.readOnly}
            name={this.props.id}
            value={this.state.value}
            rows={this.props.rows}
            placeholder={this.props.placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
          />
        );
        break;
      }

      case 'select':
        input = (
          <SelectInput
            innerRef={input => {
              this.input = input;
            }}
            id={this.props.id}
            readOnly={this.props.readOnly}
            name={this.props.id}
            value={this.state.value}
            placeholder={this.props.placeholder}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
          >
            {this.props.children}
          </SelectInput>
        );
        break;

      default:
        input = null;
    }

    return (
      <FormGroup onClick={this.focus} last={this.props.last}>
        {label}
        <InnerWrapper focus={this.state.focus}>
          {typeof this.props.leftIcon !== 'undefined' && (
            <InnerLeftIcon>{this.props.leftIcon}</InnerLeftIcon>
          )}
          <InnerInput>{input}</InnerInput>
          {typeof this.props.rightIcon !== 'undefined' && (
            <InnerRightIcon>{this.props.rightIcon}</InnerRightIcon>
          )}
        </InnerWrapper>
        {this.props.uploadingFile && <span style={{ position: 'absolute' }}>Uploading</span>}
        {this.props.uploaded && (
          <span style={{ position: 'absolute', color: 'green' }}>👍 Uploaded</span>
        )}
        {this.props.error ||
          (this.state.error && <FormError>{this.props.error || this.state.error}</FormError>)}
      </FormGroup>
    );
  }
}

// Props Validation
FormControl.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func
};
