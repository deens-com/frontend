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
    setFieldValue: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  state = {
    showWarning: false,
  };

  onDaysChange = event => {
    const newValueRaw = event.target.value;
    if (isNaN(newValueRaw)) {
      console.warn(`${newValueRaw} is not a number`);
      return;
    }
    if (newValueRaw < 1) {
      return;
    }
    const newValue = parseInt(newValueRaw, 10);
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
      this.closePopup();
    } else {
      this.setState({ showWarning: true, requestedLength: newValue, serviceRemovalCount });
    }
  };

  closePopup = () => {
    this.setState({
      showWarning: false,
      requestedLength: undefined,
      serviceRemovalCount: undefined,
    });
  };

  yesRemove = () => {
    const { name, setFieldValue, submitForm } = this.props;
    const { requestedLength } = this.state;
    setFieldValue(name, requestedLength);
    setTimeout(submitForm, 100);
    this.closePopup();
  };

  render() {
    const { name, placeholder, value, error, disabled } = this.props;
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
            icon="calendar plus outline"
            iconPosition="left"
            value={value}
            error={error}
            disabled={disabled}
            onChange={this.onDaysChange}
            onBlur={this.props.onBlur}
          />
        }
      >
        <Popup.Header>
          Remove {value - this.state.requestedLength} day(s) from your trip?
        </Popup.Header>
        <Popup.Content>
          Are you sure you want to remove {value - this.state.requestedLength} day(s) from your
          trip? Removing day(s) will cause deletion of {this.state.serviceRemovalCount} service{this
            .state.serviceRemovalCount === 1
            ? ' '
            : 's '}
          from your trip.
          <br />
          <Flex>
            <Button negative onClick={this.yesRemove}>
              Remove
            </Button>
            <Button positive onClick={this.closePopup}>
              Go back
            </Button>
          </Flex>
        </Popup.Content>
      </Popup>
    );
  }
}
