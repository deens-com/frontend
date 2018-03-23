// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import ExcerptCart from "./ExcerptCart";
import FullCart from "./FullCart";

// ACTIONS/CONFIG

// STYLES
import { Cart } from "../styles";

// MODULE
export default class DetailCart extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
    this.toggleExpansion = this.toggleExpansion.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.opening) {
      this.setState({ expanded: true });
    }
    if (nextProps.closing) {
      this.setState({ expanded: false });
    }
  }

  toggleExpansion() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <Cart withShadow column>
        {this.state.expanded ? (
          <FullCart
            data={this.props.item}
            toggleExpansion={this.toggleExpansion}
          />
        ) : (
          <ExcerptCart
            data={this.props.item}
            toggleExpansion={this.toggleExpansion}
          />
        )}
      </Cart>
    );
  }
}

// Props Validation
DetailCart.propTypes = {};
