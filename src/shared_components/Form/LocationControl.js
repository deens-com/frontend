import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PlacesAutocomplete from "react-places-autocomplete";

import Input from "./controls/Input";
import Label from "./controls/Label";
import DateInput from "./DateInput";
import PersonInput from "./PersonInput";
import { DateIcon, PersonIcon, PinIcon } from "../icons";
import TimeSelect from "./TimeSelect";

const FormGroup = styled.div`
  position: relative;
  border: 1px solid ${props => (props.focused ? "#4fb798" : "#eef1f4")};
  border-radius: 4px;
  padding: 10px 15px;
  transition: border-color 0.1s ease-out;
`;

const FormError = styled.div`
  position: relative;
  border: 1px solid ${props => (props.focused ? "#4fb798" : "#eef1f4")};
  border-radius: 4px;
  padding: 10px 15px;
  transition: border-color 0.1s ease-out;
`;

const InnerWrap = styled.div`
  display: flex;
  align-items: center;
`;

const InnerLeftIcon = styled.div`
  width: 22px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.focused ? "#4fb798" : "#d3d7dc")};

  svg {
    transition: color 0.1s ease-out;
  }
`;

export default class LocationFormControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      address: props.formatted_address || ""
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.focusElement = this.focusElement.bind(this);
  }

  componentWillUpdate(next_props) {
    if (this.did_address_props_changed(this.props, next_props)) {
      if(this.props.formatted_address === undefined && next_props.formatted_address.length){
        this.setState({address: next_props.formatted_address})
      }
      if(next_props.formatted_address === ""){
        this.setState({address: ""})
      }
    }
  }

  did_address_props_changed = (current_props, next_props) => {
    return (
      current_props.formatted_address !== next_props.formatted_address
    );
  };

  focusElement() {
    this.onFocus();
    if (this.input) {
      this.input.focus();
    }
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  onLocationChange(address) {
    this.setState({ address });
    this.props.onChange(address);
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onLocationChange,
      onBlur: this.onBlur,
      placeholder: "Location"
    };

    const customStyles = {
      input: {
        display: "inline-block",
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
        borderRadius: "4px",
        background: "none",
        padding: "6px 4px 3px",
        width: "100%",
        border: "none",
        maxWidth: "100%",
        outline: "none"
      },
      autocompleteContainer: {
        zIndex: 999999
      },
      autocompleteItem: {
        cursor: "pointer"
      },
      autocompleteItemActive: {
        backgroundColor: "#5eb79e"
      }
    };

    return (
      <FormGroup focused={this.state.focused} onClick={this.focusElement}>
        {this.props.label && (
          <Label id={this.props.id} label={this.props.label} />
        )}
        <InnerWrap>
          <InnerLeftIcon focused={this.state.focused}>
            <PinIcon />
          </InnerLeftIcon>
          <PlacesAutocomplete inputProps={inputProps} styles={customStyles} />
          {this.props.error ||
            (this.state.error && (
              <FormError>{this.props.error || this.state.error}</FormError>
            ))}
        </InnerWrap>
      </FormGroup>
    );
  }
}

LocationFormControl.propTypes = {};
