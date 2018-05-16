// NPM
import React, { Component } from "react";
import styled from "styled-components";

// COMPONENTS
import Button from "../../../shared_components/Button";
import { FilterIcon } from "../../../shared_components/icons";
import Form from "../../../shared_components/Form";
import FormControl from "../../../shared_components/Form/FormControl";

// STYLES
const WrapTrigger = styled.div`
  button {
    padding: 12px 10px;

    & > span {
      display: flex;
      align-items: center;
    }

    svg {
      font-size: 20px;
    }
  }

  svg {
    display: inline-block !important;
    margin-right: 15px;
  }
`;

const MobileWrap = styled.div`
  width: 100%;

  form {
    margin-top: 15px;
  }

  form > div {
    margin-bottom: 15px;
  }
`;

// MODULE
export default class MobileFilter extends Component {
  constructor() {
    super();
    this.state = {
      showFilters: false
    };
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  toggleFilters() {
    this.setState({ showFilters: !this.state.showFilters });
  }

  render() {
    const { onSubmit, state, onValueChange } = this.props;
    return (
      <MobileWrap>
        <WrapTrigger>
          <Button
            size="medium"
            type="button"
            onClick={this.toggleFilters}
            theme="textGreen"
          >
            <FilterIcon />
            {this.state.showFilters ? "Hide" : "Show"} filters
          </Button>
        </WrapTrigger>
        {this.state.showFilters && (
          <Form onSubmit={onSubmit}>
            <FormControl
              onChange={value => {
                onValueChange("location", value);
              }}
              value={state.location}
              type="text"
              placeholder="Location"
              leftIcon="pin"
            />
            <FormControl
              onChange={value => {
                onValueChange("startDate", value);
              }}
              value={state.startDate}
              type="date"
              placeholder="From date"
              leftIcon="date"
            />
            <FormControl
              onChange={value => {
                onValueChange("endDate", value);
              }}
              value={state.endDate}
              type="date"
              placeholder="To date"
              leftIcon="date"
            />
            <FormControl
              onChange={value => {
                onValueChange("person", value);
              }}
              value={state.person}
              type="person"
              placeholder="1"
              leftIcon="person"
            />
          </Form>
        )}
      </MobileWrap>
    );
  }
}

// Props Validation
MobileFilter.propTypes = {};
