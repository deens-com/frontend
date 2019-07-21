import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'semantic-ui-react';

// i18n
import { Trans } from '@lingui/macro';

const MAX_MINUTES = 60;
const MAX_HOURS = 24;

const unitOptions = [
  {
    value: 'minutes',
    text: 'Minutes',
    defaultValue: 30,
  },
  {
    value: 'hours',
    text: 'Hours',
    defaultValue: 2,
  },
];

export default class DurationInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.number,
  };

  static defaultProps = {
    defaultValue: 30,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
      unit: 'minutes',
    };
  }

  changeCallback = () => {
    const { unit, value } = this.state;
    const minutes = unit === 'minutes' ? value : value * 60;
    this.props.onChange(Math.round(minutes));
  };

  handleValueChange = (e, { value }) => {
    const { unit } = this.state;
    if (
      (unit === 'minutes' && parseFloat(value) > MAX_MINUTES) ||
      (unit === 'hours' && parseFloat(value) > MAX_HOURS)
    ) {
      return;
    }

    this.setState(
      {
        value,
      },
      this.changeCallback,
    );
  };

  handleUnitChange = (e, { value }) => {
    if (value === this.state.unit) {
      return;
    }

    const newValue = unitOptions.find(option => option.value === value).defaultValue;

    this.setState(
      {
        unit: value,
        value: newValue,
      },
      this.changeCallback,
    );
  };

  render() {
    const { value, unit } = this.state;
    const { error, touched, ErrorComponent } = this.props;

    return (
      <Form.Field required>
        <label>
          <Trans>Duration</Trans>
        </label>
        <Form.Group>
          <Form.Input
            name="duration"
            value={value}
            error={Boolean(error)}
            type="number"
            min={1}
            max={unit === 'minutes' ? MAX_MINUTES : MAX_HOURS}
            step={unit === 'minutes' ? 1 : 0.25}
            onChange={this.handleValueChange}
          />
          <Dropdown
            name="unit"
            selection
            value={unit}
            options={unitOptions}
            onChange={this.handleUnitChange}
          />
        </Form.Group>
        {touched && error && <ErrorComponent>{error}</ErrorComponent>}
      </Form.Field>
    );
  }
}
