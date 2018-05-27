import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Input, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import styled from 'styled-components';
import { Creatable } from 'react-select';

const serviceTypes = ['Place', 'Activity', 'Food'];
const serviceTypeDropdownOptions = serviceTypes.map(text => ({ value: text.toLowerCase(), text }));
const hours = Array.from({ length: 24 }, (v, k) => k);
const hoursDropdownOptions = hours.map(h => ({ value: h, text: h.toString().padStart(2, '0') + ':00' }));

const ErrorMsg = styled.div`
  color: red;
`;

const NewServiceForm = ({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
  const defaultProps = {
    onChange: handleChange,
    onBlur: handleBlur,
  };
  return (
    <Form onSubmit={handleSubmit}>
      {/* Type */}
      <Form.Field required>
        <label>Service type</label>
        <Dropdown placeholder="Service Type" selection options={serviceTypeDropdownOptions} />
      </Form.Field>

      {/* Name */}
      <Form.Field required>
        <label>Service name</label>
        <Form.Input name="name" placeholder="Service name" error={touched.name && errors.name} {...defaultProps} />
        {touched.name && errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
      </Form.Field>

      {/* Description */}
      <Form.Field required>
        <label>Service description</label>
        <Form.TextArea
          name="description"
          placeholder="Tell us more..."
          error={touched.description && errors.description}
          {...defaultProps}
        />
        {touched.description && errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
      </Form.Field>

      {/* Price */}
      <Form.Field required>
        <label>Price Per Day/Night</label>
        <Form.Input name="price" type="number" error={touched.price && errors.price} {...defaultProps} />
        {touched.price && errors.price && <ErrorMsg>{errors.price}</ErrorMsg>}
      </Form.Field>

      {/* Accept Ethereum */}
      <Form.Field>
        <label>Accept Ethereum</label>
        <Form.Checkbox id="acceptEthereum" name="acceptEthereum" {...defaultProps} />
      </Form.Field>

      {/* Available Days */}
      <Form.Group grouped>
        <label>Available Days</label>
        <Form.Checkbox id="sunday" name="sunday" label="Sunday" {...defaultProps} />
        <Form.Checkbox id="monday" name="monday" label="Monday" {...defaultProps} />
        <Form.Checkbox id="tuesday" name="tuesday" label="Tuesday" {...defaultProps} />
        <Form.Checkbox id="wednesday" name="wednesday" label="Wednesday" {...defaultProps} />
        <Form.Checkbox id="thursday" name="thursday" label="Thursday" {...defaultProps} />
        <Form.Checkbox id="friday" name="friday" label="Friday" {...defaultProps} />
        <Form.Checkbox id="saturday" name="saturday" label="Saturday" {...defaultProps} />
      </Form.Group>

      {/* Lat/Lng */}
      <Form.Group widths="equal">
        <Form.Input name="latitude" label="Latitude" {...defaultProps} />
        <Form.Input name="longitude" label="Longitude" {...defaultProps} />
      </Form.Group>

      {/* Timings */}
      <Form.Group widths="equal">
        <Form.Dropdown
          name="openingTime"
          label="Opening time"
          placeholder="Select opening time"
          selection
          options={hoursDropdownOptions}
        />
        <Form.Dropdown
          name="closingTime"
          label="Closing time"
          placeholder="Select closing time"
          selection
          options={hoursDropdownOptions}
        />
      </Form.Group>

      {/* Tags */}
      <Form.Field>
        <label>Tags</label>
        <Creatable name="tags" placeholder="Select..." {...defaultProps} inputProps={{ type: 'react-type' }} />
      </Form.Field>

      <Form.Button disabled={isSubmitting}>Submit</Form.Button>
    </Form>
  );
};

NewServiceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default withFormik({
  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
})(NewServiceForm);
