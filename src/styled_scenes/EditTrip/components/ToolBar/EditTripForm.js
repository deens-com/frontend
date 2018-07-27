import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import { withFormik } from 'formik';
import { Form, Dropdown } from 'semantic-ui-react';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import tagsData from './../../../../data/tags';

// import Form from 'shared_components/Form';
import { checkRequiredFields } from 'libs/Utils';
import TripLengthFormInput from './TripLengthFormInput';
import EditTripContainer from 'scenes/trips/containers/EditTripContainer';

const tagsDropdownOptions = tagsData.map(value => ({ text: value.label, value: value.label }));

const ErrorMsg = styled.div`
  color: red;
`;

const OwnerForm = styled(Form)`
  width: 100%;
`;

class EditTripForm extends Component {
  static propTypes = {
    trip: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  onLocationChange = async (address, placeId) => {
    if (!address || !placeId) return;
    const { setFieldValue, submitForm } = this.props;
    setFieldValue('formattedAddress', address);
    const results = await geocodeByPlaceId(placeId);
    const currentResult = results[0];
    const latlngPromise = getLatLng(currentResult);
    const { address_components: addressComponents } = currentResult;
    const localities = addressComponents.filter(
      c => c.types.includes('locality') || c.types.includes('postal_town'),
    );
    const countries = addressComponents.filter(c => c.types.includes('country'));
    if (countries[0] && countries[0].long_name) {
      setFieldValue('country', countries[0].long_name);
    }
    if (localities[0] && localities[0].long_name) {
      setFieldValue('city', localities[0].long_name);
    }
    const latlng = await latlngPromise;
    setFieldValue('latlng', latlng);
    submitForm();
  };

  onLocationKeyUp = () => {
    const { setValues, values } = this.props;
    setValues({ ...values, formattedAddress: '', country: '', city: '', latlng: '' });
  };

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      submitForm,
      trip,
    } = this.props;
    const isTripBooked = trip && trip.booked;
    const defaultProps = {
      onChange: handleChange,
      onBlur: submitForm,
    };
    return (
      <OwnerForm onSubmit={handleSubmit}>
        <Form.Field required>
          <label>Trip name</label>
          <Form.Input
            name="title"
            placeholder="Trip name"
            value={values.title}
            error={!!(touched.title && errors.title)}
            {...defaultProps}
          />
          {touched.title && errors.title && <ErrorMsg>{errors.title}</ErrorMsg>}
        </Form.Field>

        <Form.Field required>
          <label>Trip description</label>
          <Form.TextArea
            name="description"
            placeholder="Tell us more..."
            value={values.description}
            error={!!(touched.description && errors.description)}
            {...defaultProps}
          />
          {touched.description && errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
        </Form.Field>

        <Form.Group widths={3}>
          <Form.Field required width={12}>
            <label>Location</label>
            <SemanticLocationControl
              defaultAddress={values.formattedAddress}
              onChange={this.onLocationChange}
              onKeyUp={this.onLocationKeyUp}
              inputProps={{
                name: 'formattedAddress',
                onBlur: handleBlur,
                disabled: isTripBooked,
                error: !!(touched.formattedAddress && errors.formattedAddress),
              }}
            />
            {touched.formattedAddress &&
              errors.formattedAddress && <ErrorMsg>{errors.formattedAddress}</ErrorMsg>}
          </Form.Field>

          <Form.Field required>
            <label>Trip Length (days)</label>
            <EditTripContainer.ContextConsumer>
              {({ scheduledServices }) => (
                <TripLengthFormInput
                  name="dayCount"
                  placeholder="3"
                  value={values.dayCount}
                  error={!!(touched.dayCount && errors.dayCount)}
                  scheduledServices={scheduledServices}
                  setFieldValue={setFieldValue}
                  submitForm={submitForm}
                  {...defaultProps}
                />
              )}
            </EditTripContainer.ContextConsumer>
            {touched.dayCount && errors.dayCount && <ErrorMsg>{errors.dayCount}</ErrorMsg>}
          </Form.Field>
          <Form.Field>
            <label>Tags</label>
            <Dropdown
              name="tags"
              options={tagsDropdownOptions}
              placeholder="Edit tags"
              search
              selection
              fluid
              multiple
              value={values.tags}
              onChange={(e, { name, value }) => {
                this.props.setFieldValue('tags', value);
                setTimeout(submitForm, 1);
              }}
            />
          </Form.Field>
        </Form.Group>
      </OwnerForm>
    );
  }
}

function validate(values) {
  const requiredFields = ['title', 'description', 'formattedAddress', 'dayCount'];
  const errors = checkRequiredFields(values, requiredFields);
  if (!errors.dayCount && isNaN(values.dayCount)) {
    errors.dayCount = 'Invalid number';
  }
  if (!errors.dayCount && values.dayCount < 1) {
    errors.dayCount = 'Minimum is 1';
  }
  if (!errors.dayCount && !Number.isInteger(parseFloat(values.dayCount))) {
    errors.dayCount = 'Only integers allowed';
  }
  return errors;
}

export default withFormik({
  mapPropsToValues: ({ trip }) => ({
    title: trip.title,
    description: trip.description,
    formattedAddress: trip.formattedAddress,
    dayCount: trip.dayCount || '',
    tags: trip.tags.map(tag => tag.label) || [],
  }),
  validate,
  handleSubmit: (values, { props }) => {
    console.log('submitting', values);
    props.onSubmit(values);
  },
})(EditTripForm);
