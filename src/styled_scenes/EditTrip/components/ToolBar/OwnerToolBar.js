import React, { Component } from 'react';
import styled from 'styled-components';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import { withFormik } from 'formik';
import { Form } from 'semantic-ui-react';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';

// import Form from 'shared_components/Form';
import toolBarPropTypes from './toolbar-proptypes';
import { checkRequiredFields } from 'libs/Utils';

const ErrorMsg = styled.div`
  color: red;
`;

const OwnerForm = styled(Form)`
  width: 100%;
`;

class OwnerToolBar extends Component {
  static propTypes = toolBarPropTypes;

  onLocationChange = async (address, placeId) => {
    if (!address || !placeId) return;
    const { setFieldValue } = this.props;
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

      state,
      trip,
      onSubmit,
      onValueChange,
      onCheckAvailabilityClick,
      serviceAvailabilityCheckInProgress,
    } = this.props;
    const isTripBooked = trip && trip.booked;
    const defaultProps = {
      onChange: handleChange,
      onBlur: handleBlur,
    };
    return (
      <OwnerForm>
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
            <label>Duration (days)</label>
            <Form.Input
              name="duration"
              placeholder="3"
              type="number"
              icon="calendar outline"
              iconPosition="left"
              value={values.duration}
              error={!!(touched.duration && errors.duration)}
              {...defaultProps}
            />
            {touched.duration && errors.duration && <ErrorMsg>{errors.duration}</ErrorMsg>}
          </Form.Field>
        </Form.Group>
      </OwnerForm>
    );
  }
}

function validate(values) {
  const requiredFields = ['title', 'description', 'formattedAddress', 'duration'];
  const errors = checkRequiredFields(values, requiredFields);
  if (!errors.duration && isNaN(values.duration)) {
    errors.duration = 'Invalid number';
  }
  if (!errors.duration && !Number.isInteger(parseFloat(values.duration))) {
    errors.duration = 'Only integers allowed';
  }
  console.log('errors', errors);
  return errors;
}

export default withFormik({
  mapPropsToValues: ({ trip }) => ({
    title: trip.title,
    description: trip.description,
    formattedAddress: trip.formattedAddress,
  }),
  validate,
})(OwnerToolBar);
