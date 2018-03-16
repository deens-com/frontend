// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Detail = styled.div`
  display: flex;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LeftIcon = styled.span`
  display: inline-block;
  margin-right: 15px;
`;

const Text = styled.span`
  display: inline-block;
`;

const EditIcon = styled.span`
  display: inline-block;
`;

// MODULE
export default class CartDetail extends Component {
  constructor() {
    super();
    this.state = {
      showEdit: false
    };

    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit() {
    this.setState({ showEdit: !this.state.showEdit });
  }

  getIcon() {
    return 'LI';
  }

  render() {
    return (
      <Detail onMouseEnter={this.toggleEdit} onMouseLeave={this.toggleEdit}>
        {this.props.icon && <LeftIcon>{this.getIcon(this.props.icon)}</LeftIcon>}
        <Text>{this.props.text}</Text>
        {this.state.showEdit && <EditIcon>Edit</EditIcon>}
      </Detail>
    );
  }
}

// Props Validation
CartDetail.propTypes = {};
