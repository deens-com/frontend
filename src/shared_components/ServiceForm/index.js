import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import styled from 'styled-components';
import serviceTags from './service-tags';
import LocationFormControl from '../Form/LocationControl';

const serviceTypes = ['Place', 'Activity', 'Food'];
const serviceTypeDropdownOptions = serviceTypes.map(text => ({ value: text.toLowerCase(), text }));
const hours = Array.from({ length: 24 }, (v, k) => k);
const hoursDropdownOptions = hours.map(h => ({ value: h, text: h.toString().padStart(2, '0') + ':00' }));
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const tagsDropdownOptions = serviceTags.map(value => ({ text: value, value }));

const ErrorMsg = styled.div`
  color: red;
`;

class ServiceForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    submitInFlight: PropTypes.bool.isRequired,
    submitButtonText: PropTypes.string,
  };

  static defaultProps = {
    submitButtonText: 'Submit',
  };

  state = {
    tagOptions: [],
  };

  onDropDownChange = (e, { name, value }) => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldValue(name, value);
    setFieldTouched(name, true, false);
  };

  onAvailableDaysChange = (e, { label, checked }) => {
    const { values, setFieldValue, setFieldTouched } = this.props;
    const availableDays = values.availableDays;
    if (checked) {
      // checked
      availableDays.add(label);
    } else {
      // unchecked
      availableDays.delete(label);
    }
    setFieldValue('availableDays', availableDays);
    setFieldTouched('availableDays', true, false);
  };

  onFileSelect = e => {
    const { setFieldValue, setFieldTouched } = this.props;
    const file = e.currentTarget.files[0];
    if (!file) return;
    setFieldValue('mainPicture', file);
    setFieldTouched('mainPicture', true, false);
  };

  onLocationChange = address => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldValue('latlong', null);
    setFieldTouched('latlong', true, false);
  };

  onLocationSelect = (address, placeId) => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('latlong', true, false);
    geocodeByPlaceId(placeId)
      .then(results => {
        const currentResult = results[0];
        const latlngPromise = getLatLng(currentResult);
        setFieldValue('formattedAddress', currentResult.formatted_address);
        const { address_components: addressComponents } = currentResult;
        const localities = addressComponents.filter(c => c.types.includes('locality'));
        const countries = addressComponents.filter(c => c.types.includes('country'));
        if (countries[0] && countries[0].long_name) {
          setFieldValue('country', countries[0].long_name);
        }
        if (localities[0] && localities[0].long_name) {
          setFieldValue('city', localities[0].long_name);
        }
        return latlngPromise;
      })
      .catch(err => {
        setFieldValue('latlong', null);
      })
      .then(value => {
        setFieldValue('latlong', value);
      });
  };

  render() {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, submitInFlight } = this.props;
    const defaultProps = {
      onChange: handleChange,
      onBlur: handleBlur,
    };
    return (
      <Form onSubmit={handleSubmit} loading={submitInFlight}>
        {/* Service Type */}
        <Form.Field required>
          <label>Service type</label>
          <Dropdown
            name="type"
            placeholder="Service Type"
            selection
            value={values.type}
            options={serviceTypeDropdownOptions}
            onChange={this.onDropDownChange}
            error={!!(touched.type && errors.type)}
          />
          {touched.type && errors.type && <ErrorMsg>{errors.type}</ErrorMsg>}
        </Form.Field>

        {/* Name */}
        <Form.Field required>
          <label>Service name</label>
          <Form.Input
            name="name"
            placeholder="Service name"
            value={values.name}
            error={!!(touched.name && errors.name)}
            {...defaultProps}
          />
          {touched.name && errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
        </Form.Field>

        {/* Description */}
        <Form.Field required>
          <label>Service description</label>
          <Form.TextArea
            name="description"
            placeholder="Tell us more..."
            value={values.description}
            error={!!(touched.description && errors.description)}
            {...defaultProps}
          />
          {touched.description && errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
        </Form.Field>

        {/* Price */}
        <Form.Field required>
          <label>Price Per Day/Night</label>
          <Form.Input
            name="pricePerSession"
            value={values.pricePerSession}
            error={!!(touched.pricePerSession && errors.pricePerSession)}
            {...defaultProps}
          />
          {touched.pricePerSession && errors.pricePerSession && <ErrorMsg>{errors.pricePerSession}</ErrorMsg>}
        </Form.Field>

        {/* Accept Ethereum */}
        <Form.Field>
          <label>Accept Ethereum</label>
          <Form.Checkbox id="acceptETH" name="acceptETH" checked={values.acceptETH} {...defaultProps} />
        </Form.Field>

        {/* Available Days */}
        <Form.Group grouped>
          <label>Available Days</label>
          {weekDays.map(weekDay => (
            <Form.Checkbox
              id={weekDay}
              label={weekDay}
              key={weekDay}
              name={weekDay}
              checked={values.availableDays.has(weekDay)}
              onChange={this.onAvailableDaysChange}
            />
          ))}
          {touched.availableDays && errors.availableDays && <ErrorMsg>{errors.availableDays}</ErrorMsg>}
        </Form.Group>

        {/* Location search */}
        <Form.Field required>
          <label>Location</label>
          <LocationFormControl
            formatted_address={values.formattedAddress}
            onChange={this.onLocationChange}
            onSelect={this.onLocationSelect}
          />
          {touched.latlong && errors.latlong && <ErrorMsg>{errors.latlong}</ErrorMsg>}
        </Form.Field>

        {/* Timings */}
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Dropdown
              name="openingTime"
              label="Opening time"
              placeholder="Select opening time"
              selection
              required
              value={values.openingTime}
              options={hoursDropdownOptions}
              onChange={this.onDropDownChange}
              error={!!(touched.openingTime && errors.openingTime)}
            />
            {touched.openingTime && errors.openingTime && <ErrorMsg>{errors.openingTime}</ErrorMsg>}
          </Form.Field>
          <Form.Field>
            <Form.Dropdown
              name="closingTime"
              label="Closing time"
              placeholder="Select closing time"
              selection
              required
              value={values.closingTime}
              options={hoursDropdownOptions}
              onChange={this.onDropDownChange}
              error={!!(touched.closingTime && errors.closingTime)}
            />
            {touched.closingTime && errors.closingTime && <ErrorMsg>{errors.closingTime}</ErrorMsg>}
          </Form.Field>
        </Form.Group>

        {/* Slots in a Day */}
        <Form.Field required>
          <label>Slots in a Day</label>
          <Form.Input
            name="slots"
            type="number"
            min="0"
            value={values.slots}
            error={!!(touched.slots && errors.slots)}
            {...defaultProps}
          />
          {touched.slots && errors.slots && <ErrorMsg>{errors.slots}</ErrorMsg>}
        </Form.Field>

        {/* Tags */}
        <Form.Field>
          <label>Tags</label>
          <Dropdown
            name="tags"
            options={tagsDropdownOptions}
            placeholder="Add tags"
            search
            selection
            fluid
            multiple
            value={values.tags}
            onChange={this.onDropDownChange}
          />
        </Form.Field>

        <Form.Field>
          <label>Service Picture</label>
          <input type="file" name="mainPicture" accept=".jpg, .jpeg, .png" onChange={this.onFileSelect} />
        </Form.Field>

        <Form.Button disabled={submitInFlight}>{this.props.submitButtonText}</Form.Button>
      </Form>
    );
  }
}

function validate(values) {
  const requiredFields = [
    'type',
    'name',
    'description',
    'pricePerSession',
    'availableDays',
    'openingTime',
    'closingTime',
    'slots',
    'latlong',
  ];
  const errors = checkRequiredFields(values, requiredFields);
  const numericFields = ['pricePerSession', 'slots'];
  for (const field of numericFields) {
    if (!errors[field] && isNaN(values[field])) {
      errors[field] = 'Invalid number';
    }
  }
  const hourFields = ['openingTime', 'closingTime'];
  for (const field of hourFields) {
    if (!errors[field] && (values[field] < 0 || values[field] > 23)) {
      errors[field] = 'Invalid hour';
    }
  }

  return errors;
}

function checkRequiredFields(values, requiredFields) {
  return requiredFields.reduce((errors, fieldName) => {
    const fieldValue = values[fieldName];
    if (fieldValue == null || fieldValue.length === 0 || fieldValue.size === 0) errors[fieldName] = 'Required';
    return errors;
  }, {});
}

export default withFormik({
  mapPropsToValues: props => {
    const values = {
      type: (props.service && props.service.type) || null,
      name: (props.service && props.service.name) || '',
      description: (props.service && props.service.description) || '',
      pricePerSession: (props.service && props.service.pricePerSession) || '',
      acceptETH: (props.service && props.service.acceptETH) || false,
      availableDays: (props.service && props.service.DayList && new Set(props.service.DayList)) || new Set(),
      openingTime: (props.service && props.service.openingTime) || null,
      closingTime: (props.service && props.service.closingTime) || null,
      slots: (props.service && props.service.slots) || '',
      latlong: (props.service && props.service.latlong) || null,
      tags: (props.service && props.service.tags) || [],
      formattedAddress: (props.service && props.service.formattedAddress) || '',
    };
    return values;
  },
  validate,
  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
  enableReinitialize: true,
})(ServiceForm);
