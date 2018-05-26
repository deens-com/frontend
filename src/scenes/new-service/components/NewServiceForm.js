import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import styled from 'styled-components';

const serviceTypes = ['Place', 'Activity', 'Food'];
const serviceTypeDropdownOptions = serviceTypes.map(text => ({ value: text.toLowerCase(), text }));

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
