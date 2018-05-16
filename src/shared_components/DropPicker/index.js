// NPM
import React, { Component } from "react";
import styled from "styled-components";

// COMPONENTS
import Trigger from "./Trigger";
import Drop from "./Drop";

// ACTIONS/CONFIG

// STYLES
const Wrap = styled.div`
  position: relative;
  display: inline-block;
`;

// MODULE
export default class DropPicker extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.toggleDrop = this.toggleDrop.bind(this);
  }

  handleBlur(ev) {
    if (ev.currentTarget.contains(ev.relatedTarget)) {
      this.setState({ isOpen: false });
    }
  }

  toggleDrop() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { children } = this.props;
    const { isOpen } = this.state;
    const { toggleDrop } = this;
    const modChildren = React.Children.map(children, child => {
      // COMMENT: the second condition is specifically for Gatsby.js problems
      if (child.type === Trigger || child.type === <Trigger />.type) {
        return React.cloneElement(child, {
          expanded: this.state.isOpen,
          onClick() {
            toggleDrop();
          }
        });
        // COMMENT: the second condition is specifically for Gatsby.js problems
      } else if (child.type === Drop || child.type === <Drop />.type) {
        if (isOpen) {
          return React.cloneElement(child, {
            onToggle() {
              toggleDrop();
            }
          });
        }
      }
      return null;
    });

    // console.log(children);
    return <Wrap onBlur={this.handleBlur}>{modChildren}</Wrap>;
  }
}

// Props Validation
DropPicker.propTypes = {};
