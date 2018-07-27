import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Popup } from 'semantic-ui-react';
import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  button:last-child {
    margin-left: auto;
  }
`;

export default class TripLengthFormInput extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    error: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    scheduledServices: PropTypes.array.isRequired,
  };

  state = {
    showWarning: false,
  };

  onDaysChange = event => {
    const newValue = event.target.value;
    const { scheduledServices, onChange } = this.props;
    const daysToBeRemoved = scheduledServices.filter(
      ({ day, services }) => day > newValue && services.length > 0,
    );
    const serviceRemovalCount = daysToBeRemoved.reduce(
      (sum, { services }) => sum + services.length,
      0,
    );
    console.log(`days: ${daysToBeRemoved.length}, services: ${serviceRemovalCount}`);
    if (daysToBeRemoved.length === 0) {
      onChange(event);
    } else {
      this.setState({ showWarning: true, requestedLength: newValue, serviceRemovalCount });
    }
  };

  render() {
    const { name, placeholder, value, error } = this.props;
    return (
      <Popup
        open={this.state.showWarning}
        position="bottom left"
        wide
        trigger={
          <Form.Input
            name={name}
            placeholder={placeholder}
            type="number"
            icon="calendar outline"
            iconPosition="left"
            value={value}
            error={error}
            onChange={this.onDaysChange}
            onBlur={this.props.onBlur}
          />
        }
      >
        <Popup.Header>Remove {this.state.serviceRemovalCount} services?</Popup.Header>
        <Popup.Content>
          Are you sure you want to remove {this.state.requestedLength} day(s) from your trip?
          <br />
          It'll remove {this.state.serviceRemovalCount} services existing in those days
          <br />
          <Flex>
            <Button negative>Remove</Button>
            <Button positive>Go back</Button>
          </Flex>
        </Popup.Content>
      </Popup>
    );
  }
}
