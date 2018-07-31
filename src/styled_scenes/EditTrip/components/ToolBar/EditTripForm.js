import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import { withFormik } from 'formik';
import { Form, Dropdown, Segment, Label } from 'semantic-ui-react';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import tagsData from 'data/tags';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate } from 'react-day-picker/moment';

// import Form from 'shared_components/Form';
import { checkRequiredFields, getISODateString } from 'libs/Utils';
import TripLengthFormInput from './TripLengthFormInput';
import EditTripContainer from 'scenes/trips/containers/EditTripContainer';

const tagsDropdownOptions = tagsData.map(value => ({ text: value.label, value: value.label }));

const ErrorMsg = styled.div`
  color: red;
`;

const OwnerForm = styled(Form)`
  width: 100%;
  .DayPickerInput {
    min-width: 100%;
  }
`;

class EditTripForm extends Component {
  static propTypes = {
    trip: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.validateForm();
  }

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

  onTagsChange = (e, { value }) => {
    this.props.setFieldValue('tags', value);
    setTimeout(this.props.submitForm, 1);
  };

  onStartDateChange = day => {
    this.props.setFieldValue('beginDate', day);
    setTimeout(this.props.submitForm, 1);
  };

  renderStartDateInput = props => (
    <Form.Input icon="calendar outline" iconPosition="left" {...props} />
  );

  render() {
    const {
      values,
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
            error={!!errors.title}
            disabled={isTripBooked}
            {...defaultProps}
          />
          {errors.title && <ErrorMsg>{errors.title}</ErrorMsg>}
        </Form.Field>

        <Form.Field required>
          <label>Trip description</label>
          <Form.TextArea
            name="description"
            placeholder="Tell us more..."
            value={values.description}
            error={!!errors.description}
            disabled={isTripBooked}
            {...defaultProps}
          />
          {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
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
                error: !!errors.formattedAddress,
              }}
            />
            {errors.formattedAddress && <ErrorMsg>{errors.formattedAddress}</ErrorMsg>}
          </Form.Field>

          <Form.Field required>
            <label>Trip Length (days)</label>
            <EditTripContainer.ContextConsumer>
              {({ scheduledServices }) => (
                <TripLengthFormInput
                  name="dayCount"
                  placeholder="3"
                  value={values.dayCount}
                  error={!!errors.dayCount}
                  scheduledServices={scheduledServices}
                  setFieldValue={setFieldValue}
                  submitForm={submitForm}
                  disabled={isTripBooked}
                  {...defaultProps}
                />
              )}
            </EditTripContainer.ContextConsumer>
            {errors.dayCount && <ErrorMsg>{errors.dayCount}</ErrorMsg>}
          </Form.Field>
        </Form.Group>

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
            disabled={isTripBooked}
            onChange={this.onTagsChange}
          />
        </Form.Field>

        <Segment padded>
          <Label attached="top">Required if booking this trip</Label>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Start date</label>
              <DayPickerInput
                value={values.beginDate}
                component={this.renderStartDateInput}
                formatDate={formatDate}
                format="LL"
                inputProps={{
                  name: 'beginDate',
                  disabled: isTripBooked,
                  readOnly: true,
                  placeholder: 'Select start date',
                }}
                dayPickerProps={{
                  disabledDays: { before: new Date() },
                  selectedDays: values.beginDate,
                }}
                onDayChange={this.onStartDateChange}
              />
              {errors.beginDate && <ErrorMsg>{errors.beginDate}</ErrorMsg>}
            </Form.Field>

            <Form.Field>
              <label>Number of people</label>
              <Form.Input
                name="numberOfPerson"
                placeholder="2"
                type="number"
                icon="user"
                iconPosition="left"
                value={values.numberOfPerson}
                error={!!errors.numberOfPerson}
                disabled={isTripBooked}
                {...defaultProps}
              />
              {errors.numberOfPerson && <ErrorMsg>{errors.numberOfPerson}</ErrorMsg>}
            </Form.Field>
          </Form.Group>
        </Segment>
      </OwnerForm>
    );
  }
}

function validate(values) {
  const requiredFields = ['title', 'description', 'formattedAddress', 'dayCount'];
  const errors = checkRequiredFields(values, requiredFields);
  const integerFields = ['dayCount', 'peopleCount'];
  for (const field of integerFields) {
    const value = values[field];
    if (!errors[field] && value && isNaN(value)) {
      errors[field] = 'Invalid number';
    }
    if (!errors[field] && value && value < 1) {
      errors[field] = 'Minimum is 1';
    }
    if (!errors[field] && value && !Number.isInteger(parseFloat(value))) {
      errors[field] = 'Only integers allowed';
    }
  }
  return errors;
}

export default withFormik({
  mapPropsToValues: ({ trip }) => ({
    title: trip.title,
    description: trip.description,
    formattedAddress: trip.formattedAddress,
    dayCount: trip.dayCount || '',
    tags: (trip.tags || []).map(tag => tag.label),
    beginDate: new Date(getISODateString(trip.beginDate)),
    numberOfPerson: trip.numberOfPerson,
  }),
  validate,
  handleSubmit: (values, { props }) => {
    console.log('submitting', values);
    props.onSubmit(values);
  },
})(EditTripForm);
