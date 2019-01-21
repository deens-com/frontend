import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form, Modal, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import styled from 'styled-components';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import HelpTooltip from 'shared_components/HelpTooltip';
import history from './../../main/history';
import { checkRequiredFields } from 'libs/Utils';
import i18n from './../../libs/i18n';
import MultiImageUploader from 'shared_components/MultiImageUploader/MultiImageUploader';
import DateInput from '../Form/DateInput';
import DurationInput from './DurationInput';

const serviceCategories = [
  { label: i18n.t('places.singular'), value: 'Accommodation' },
  { label: i18n.t('activities.singular'), value: 'Activity' },
  { label: i18n.t('foods.singular'), value: 'Food' },
];

const serviceTypeDropdownOptions = serviceCategories.map(text => ({
  value: text.value,
  text: text.label,
}));

const hours = Array.from({ length: 24 }, (v, k) => k);

const hoursDropdownOptions = hours.map(h => ({
  value: h,
  text: h.toString().padStart(2, '0') + ':00',
}));

const weekDays = [
  { text: 'Monday', value: 'monday' },
  { text: 'Tuesday', value: 'tuesday' },
  { text: 'Wednesday', value: 'wednesday' },
  { text: 'Thursday', value: 'thursday' },
  { text: 'Friday', value: 'friday' },
  { text: 'Saturday', value: 'saturday' },
  { text: 'Sunday', value: 'sunday' },
];

const refundTypes = [
  { text: 'Non-refundable', value: 'none' },
  { text: 'Fixed value', value: 'fixed' },
  { text: 'Percentage', value: 'percent' },
];

const ErrorMsg = styled.div`
  color: red;
`;

const AddRuleContainer = styled.div`
  margin-bottom: 15px;
`;

const RulesLabel = styled.label`
  font-weight: bold;
`;

const FormWrapper = styled.div`
  .DayPickerInput {
    display: block;
  }
`;

const LabelWithIcon = styled.label`
  span {
    display: inline-block;
  }
  display: inline-block !important;
  position: relative;
`;

const Icon = styled.span`
  position: absolute;
  top: 0;
  right: -30px;
  color: grey;
`;

const facebookUrl = /^(?:(?:https?):\/\/)?(?:www.)?((facebook\.com)|(fb\.me))\/(#?\/?[a-zA-Z0-9#]+)+\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const twitterUrl = /^(?:(?:https?):\/\/)?(?:www.)?((twitter\.com))\/(#?\/?[a-zA-Z0-9#]+)+\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const websiteUrl = /^(?:(?:https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceId: null,
      uploadingImages: false,
    };
    this.uploadingImagesSet = new Set();

    if (this.props.creatingFromLink) {
      const { setFieldValue } = props;
      setFieldValue('isShortVersion', true);
    }
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    submitInFlight: PropTypes.bool.isRequired,
    globalError: PropTypes.object,
    submitButtonText: PropTypes.string,
    creatingFromLink: PropTypes.bool,
  };

  static defaultProps = {
    submitButtonText: 'Submit',
    globalError: {},
  };

  state = {
    tagOptions: [],
    showGlobalError: false,
  };

  onDropDownChange = (e, { name, value }) => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldValue(name, value);
    setFieldTouched(name, true, false);
  };

  onLocationKeyUp = () => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldValue('latlong', null);
    setFieldTouched('latlong', true, false);
  };

  handleStartDateChange = date => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('startDate', true);
    setFieldValue('startDate', date);
  };

  handleEndDateChange = date => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('endDate', true);
    setFieldValue('endDate', date);
  };

  onLocationSelect = (address, placeId) => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('latlong', true, false);
    geocodeByPlaceId(placeId)
      .then(results => {
        const currentResult = results[0];
        setFieldValue('location', currentResult);
        const latlngPromise = getLatLng(currentResult);
        setFieldValue('formattedAddress', currentResult.formatted_address);
        const { address_components: addressComponents } = currentResult;
        const localities = addressComponents.filter(
          c => c.types.includes('locality') || c.types.includes('postal_town'),
        );
        const countries = addressComponents.filter(c => c.types.includes('country'));
        const postalCodes = addressComponents.filter(c => c.types.includes('postal_code'));
        const state = addressComponents.filter(c =>
          c.types.includes('"administrative_area_level_1"'),
        )[0];
        if (countries[0] && countries[0].long_name) {
          setFieldValue('country', countries[0].long_name);
          setFieldValue('countryCode', countries[0].short_name);
        }
        if (localities[0] && localities[0].long_name) {
          setFieldValue('city', localities[0].long_name);
        }
        if (postalCodes[0] && postalCodes[0].long_name) {
          setFieldValue('postalCode', postalCodes[0].long_name);
        }
        if (state) {
          setFieldValue('state', state);
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

  onUploadedFilesChanged = (mediaUrls, id, hero) => {
    this.uploadingImagesSet.delete(id);

    if (this.uploadingImagesSet.size === 0) {
      this.setState({
        uploadingImages: false,
      });
    }

    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('media', true);
    setFieldValue(
      'media',
      mediaUrls.map(url => {
        return {
          ...url,
          hero: hero === url.id,
        };
      }),
    );
  };

  onStartedUpload = id => {
    this.uploadingImagesSet.add(id);

    this.setState({
      uploadingImages: true,
    });
  };

  componentWillReceiveProps(nextProps) {
    const { globalError } = nextProps;

    if (globalError.message !== undefined) {
      this.setState({ showGlobalError: true });
      this.setState({ serviceId: globalError.serviceId });
    }
  }

  handleModalClose = () => {
    history.push('/services/edit/' + this.state.serviceId);
    this.setState({ showGlobalError: false });
    this.props.resetErrors();
  };

  changeDuration = duration => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('duration', true);
    setFieldValue('duration', duration);
  };

  addRule = e => {
    e.preventDefault();
    this.props.setFieldValue('rules', [...this.props.values.rules, '']);
  };

  removeRule = (index, e) => {
    e.preventDefault();
    this.props.setFieldValue('rules', this.props.values.rules.filter((_, i) => i !== index));
  };

  renderSubmitText() {
    if (this.props.submitInFlight) {
      return 'Submitting...';
    }
    if (this.state.uploadingImages) {
      return 'Uploading images...';
    }

    return this.props.submitButtonText;
  }

  render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      globalError,
      handleSubmit,
      submitInFlight,
      service,
      creatingFromLink,
    } = this.props;

    const defaultProps = {
      onChange: handleChange,
      onBlur: handleBlur,
    };

    // we're using the key prop over here because we want to re-create the form component once we get the service
    return (
      <FormWrapper>
        <Form key={service && service.objectId} onSubmit={handleSubmit} loading={submitInFlight}>
          <Modal
            closeOnDimmerClick={false}
            size="tiny"
            open={this.state.showGlobalError}
            onClose={this.handleModalClose}
          >
            <Modal.Header>There was an issue with creating your service</Modal.Header>
            <Modal.Content>{globalError.message}</Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={this.handleModalClose}>
                Close
              </Button>
            </Modal.Actions>
          </Modal>

          {/* Type of service */}
          <Form.Field required>
            <label>Type of service</label>
            <Dropdown
              name="category"
              placeholder="Type of service"
              selection
              value={values.category}
              options={serviceTypeDropdownOptions}
              onChange={this.onDropDownChange}
              error={!!(touched.category && errors.category)}
            />
            {touched.category && errors.category && <ErrorMsg>{errors.category}</ErrorMsg>}
          </Form.Field>

          {/* Location search */}
          <Form.Field required>
            <LabelWithIcon>
              <span>Location</span>
              <Icon>
                <HelpTooltip
                  style={{ width: 16, height: 16 }}
                  content="Please state your service location"
                />
              </Icon>
            </LabelWithIcon>
            <SemanticLocationControl
              defaultAddress={values.formattedAddress}
              onKeyUp={this.onLocationKeyUp}
              onChange={this.onLocationSelect}
            />
            {touched.latlong && errors.latlong && <ErrorMsg>{errors.latlong}</ErrorMsg>}
          </Form.Field>

          {/* Title */}
          <Form.Field required>
            <label>Title</label>
            <Form.Input
              name="title"
              placeholder="Title"
              value={values.title}
              error={!!(touched.title && errors.title)}
              {...defaultProps}
            />
            {touched.title && errors.title && <ErrorMsg>{errors.title}</ErrorMsg>}
          </Form.Field>

          {/* Subtitle */}
          <Form.Field required>
            <LabelWithIcon>
              <span>Sub-title</span>
              <Icon>
                <HelpTooltip
                  style={{ width: 16, height: 16 }}
                  content="Sub-title is a one sentence service explanation"
                />
              </Icon>
            </LabelWithIcon>
            <Form.Input
              name="subtitle"
              placeholder="Sub-title"
              value={values.subtitle}
              error={!!(touched.subtitle && errors.subtitle)}
              {...defaultProps}
            />
            {touched.subtitle && errors.subtitle && <ErrorMsg>{errors.subtitle}</ErrorMsg>}
          </Form.Field>

          {/* Description */}
          <Form.Field required>
            <LabelWithIcon>
              <span>Description</span>
              <Icon>
                <HelpTooltip
                  style={{ width: 16, height: 16 }}
                  content="Please describe your service in detail in this field"
                />
              </Icon>
            </LabelWithIcon>
            <Form.TextArea
              name="description"
              placeholder="Tell us more..."
              value={values.description}
              error={!!(touched.description && errors.description)}
              {...defaultProps}
            />
            {touched.description && errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
          </Form.Field>

          {/* Tags */}
          <Form.Field>
            <LabelWithIcon>
              <span>Tags</span>
              <Icon>
                <HelpTooltip
                  style={{ width: 16, height: 16 }}
                  content="Search labels which are applicable to your service to make it easy to find on search by users"
                />
              </Icon>
            </LabelWithIcon>
            <Dropdown
              name="tags"
              options={this.props.serviceFormTagsOptions.map(tag => {
                return { text: tag.names['en-us'], value: tag._id };
              })}
              placeholder="Add tags"
              search
              selection
              fluid
              multiple
              value={values.tags}
              onChange={this.onDropDownChange}
            />
          </Form.Field>

          {/* Multi image upload */}
          <Form.Field>
            <label>Pictures (the first one you upload will be your main service picture)</label>
            <MultiImageUploader
              value={values.media}
              onUploadedFilesChanged={this.onUploadedFilesChanged}
              initialUploadedFiles={values.media}
              onStartedUpload={this.onStartedUpload}
            />
          </Form.Field>

          {/* Duration */}
          {values.category !== 'Accommodation' &&
            !creatingFromLink && (
              <DurationInput
                onChange={this.changeDuration}
                onTouch={this.handleDurationTouch}
                defaultValue={Number(values.duration) || undefined}
                touched={touched.duration}
                error={errors.duration}
                ErrorComponent={ErrorMsg}
              />
            )}

          {/* Price */}
          <Form.Field required>
            <label>
              {values.category === 'Food' ? 'Average Price per person' : 'Price'} ($ USD)
            </label>
            <Form.Input
              name="basePrice"
              value={values.basePrice}
              error={!!(touched.basePrice && errors.basePrice)}
              {...defaultProps}
            />
            {touched.basePrice && errors.basePrice && <ErrorMsg>{errors.basePrice}</ErrorMsg>}
          </Form.Field>

          {!creatingFromLink && (
            <React.Fragment>
              {/* Rules */}
              <React.Fragment>
                <RulesLabel>Rules</RulesLabel>
                {values.rules.map((rule, index) => (
                  <Form.Group key={`rule-${index}`}>
                    <Form.Field style={{ flex: 1 }}>
                      <label>{`Rule ${index + 1}`}</label>
                      <Form.Input
                        name={`rules[${index}]`}
                        value={rule}
                        error={!!(touched.rule && errors.rule)}
                        {...defaultProps}
                      />
                      {touched.rule && errors.rule && <ErrorMsg>{errors.rule}</ErrorMsg>}
                    </Form.Field>
                    <Button
                      color="red"
                      size="mini"
                      onClick={this.removeRule.bind(this, index)}
                      style={{
                        marginBottom: '3px',
                        alignSelf: 'flex-end',
                        height: '3em',
                      }}
                    >
                      Remove
                    </Button>
                  </Form.Group>
                ))}
                <AddRuleContainer>
                  <Button color="green" size="small" onClick={this.addRule}>
                    Add rule
                  </Button>
                </AddRuleContainer>
              </React.Fragment>

              {/* Instruction */}
              <Form.Field>
                <label>Instructions given before your service start time</label>
                <Form.TextArea name="start" value={values.start} {...defaultProps} />
              </Form.Field>
              <Form.Field>
                <label>Instructions given before your service end time</label>
                <Form.TextArea name="end" value={values.end} {...defaultProps} />
              </Form.Field>

              {/* Period date */}
              <Form.Group widths="equal">
                <Form.Field required>
                  <LabelWithIcon>
                    <span>Start date</span>
                    <Icon>
                      <HelpTooltip
                        style={{ width: 16, height: 16 }}
                        content="Starting date of your service"
                      />
                    </Icon>
                  </LabelWithIcon>
                  <DateInput
                    onChange={this.handleStartDateChange}
                    placeholder="Start date"
                    label="Start date"
                    leftIcon="date"
                    value={values.startDate}
                    innerRef={input => {
                      this.startDateInput = input;
                    }}
                    dayPickerProps={{ disabledDays: { before: new Date() } }}
                  />
                  {touched.startDate && errors.startDate && <ErrorMsg>{errors.startDate}</ErrorMsg>}
                </Form.Field>

                <Form.Field required>
                  <LabelWithIcon>
                    <span>End date</span>
                    <Icon>
                      <HelpTooltip
                        style={{ width: 16, height: 16 }}
                        content="Ending date of your service"
                      />
                    </Icon>
                  </LabelWithIcon>
                  <DateInput
                    onChange={this.handleEndDateChange}
                    placeholder="End date"
                    leftIcon="date"
                    value={values.endDate}
                    dayPickerProps={{
                      disabledDays: { before: values.startDate || new Date() },
                      month: values.startDate,
                    }}
                    innerRef={input => {
                      this.endDateInput = input;
                    }}
                  />
                  {touched.endDate && errors.endDate && <ErrorMsg>{errors.endDate}</ErrorMsg>}
                </Form.Field>
              </Form.Group>

              {/* Available Days */}
              <Form.Group grouped>
                <Form.Field required>
                  <label>Days this service is available</label>
                  <Dropdown
                    name="availableDays"
                    placeholder="Select available days"
                    selection
                    multiple
                    value={values.availableDays}
                    options={weekDays}
                    onChange={this.onDropDownChange}
                    error={!!(touched.availableDays && errors.availableDays)}
                  />
                  {touched.availableDays &&
                    errors.availableDays && <ErrorMsg>{errors.availableDays}</ErrorMsg>}
                </Form.Field>
              </Form.Group>

              {/* Timings */}
              <Form.Group widths="equal">
                <Form.Field>
                  <Form.Dropdown
                    name="openingTime"
                    label="Opening time"
                    placeholder="Select opening time"
                    selection
                    value={values.openingTime}
                    options={hoursDropdownOptions}
                    onChange={this.onDropDownChange}
                    error={!!(touched.openingTime && errors.openingTime)}
                  />
                  {touched.openingTime &&
                    errors.openingTime && <ErrorMsg>{errors.openingTime}</ErrorMsg>}
                </Form.Field>
                <Form.Field>
                  <Form.Dropdown
                    name="closingTime"
                    label="Closing time"
                    placeholder="Select closing time"
                    selection
                    value={values.closingTime}
                    options={hoursDropdownOptions}
                    onChange={this.onDropDownChange}
                    error={!!(touched.closingTime && errors.closingTime)}
                  />
                  {touched.closingTime &&
                    errors.closingTime && <ErrorMsg>{errors.closingTime}</ErrorMsg>}
                </Form.Field>
              </Form.Group>

              {/* Slots in a Day */}
              <Form.Field required>
                <LabelWithIcon>
                  <span>Number of slots available</span>
                  <Icon>
                    <HelpTooltip
                      style={{ width: 16, height: 16 }}
                      content="Number of available slots"
                    />
                  </Icon>
                </LabelWithIcon>
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

              {/* Links */}
              <Form.Group widths="equal">
                <Form.Field>
                  <label>Facebook Link</label>
                  <Form.Input
                    name="facebook"
                    value={values.facebook}
                    error={!!(touched.facebook && errors.facebook)}
                    {...defaultProps}
                  />
                  {touched.facebook && errors.facebook && <ErrorMsg>{errors.facebook}</ErrorMsg>}
                </Form.Field>
                <Form.Field>
                  <label>Twitter Link</label>
                  <Form.Input
                    name="twitter"
                    value={values.twitter}
                    error={!!(touched.twitter && errors.twitter)}
                    {...defaultProps}
                  />
                  {touched.twitter && errors.twitter && <ErrorMsg>{errors.twitter}</ErrorMsg>}
                </Form.Field>
                <Form.Field>
                  <label>Website Link</label>
                  <Form.Input
                    name="website"
                    value={values.website}
                    error={!!(touched.website && errors.website)}
                    {...defaultProps}
                  />
                  {touched.website && errors.website && <ErrorMsg>{errors.website}</ErrorMsg>}
                </Form.Field>
              </Form.Group>
            </React.Fragment>
          )}

          {/* Cancellation policy */}
          <Form.Group widths="equal">
            <Form.Field>
              <label>Cancellation policy</label>
              <Dropdown
                name="refundType"
                placeholder="Select refund type"
                selection
                value={values.refundType}
                options={refundTypes}
                onChange={this.onDropDownChange}
              />
            </Form.Field>
            {values.refundType !== 'none' && (
              <React.Fragment>
                <Form.Field required>
                  <label>{`Refund ${
                    values.refundType === 'percent' ? 'percentage' : 'amount'
                  }`}</label>
                  <Form.Input
                    name="refundAmount"
                    value={values.refundAmount}
                    error={!!(touched.refundType && errors.refundAmount)}
                    placeholder={`Cancellation fee ${
                      values.refundType === 'percent' ? '(%)' : 'amount'
                    }`}
                    {...defaultProps}
                  />
                  {touched.refundType &&
                    errors.refundAmount && <ErrorMsg>{errors.refundAmount}</ErrorMsg>}
                </Form.Field>
                <Form.Field required>
                  <label>Duration (in days)</label>
                  <Form.Input
                    name="refundDuration"
                    value={values.refundDuration}
                    error={!!(touched.refundType && errors.refundDuration)}
                    placeholder="Duration"
                    {...defaultProps}
                  />
                  {touched.refundType &&
                    errors.refundDuration && <ErrorMsg>{errors.refundDuration}</ErrorMsg>}
                </Form.Field>
              </React.Fragment>
            )}
          </Form.Group>

          <Form.Button color="green" disabled={submitInFlight || this.state.uploadingImages}>
            {this.renderSubmitText()}
          </Form.Button>
        </Form>
      </FormWrapper>
    );
  }
}

function validate(values) {
  const shortVersion = values.isShortVersion;

  const requiredFields = ['category', 'title', 'subtitle', 'description', 'basePrice', 'latlong'];

  if (!shortVersion) {
    requiredFields.push('duration', 'availableDays', 'startDate', 'endDate', 'slots');
  }

  if (values.refundType !== 'none') {
    requiredFields.push('refundDuration', 'refundAmount');
  }

  const errors = checkRequiredFields(values, requiredFields);

  const numericFields = ['basePrice', 'slots', 'duration'];

  for (const field of numericFields) {
    if (!errors[field] && isNaN(values[field])) {
      errors[field] = 'Invalid number';
    }
  }

  if (Number(values['basePrice']) < 0) {
    errors['basePrice'] = 'Price must be at least 0';
  }

  if (!isNaN(parseFloat(values['slots'])) && parseFloat(values['slots']) < 1) {
    errors['slots'] = 'Slots must be at least 1';
  }

  if (!isNaN(parseFloat(values['duration'])) && parseFloat(values['duration']) < 1) {
    errors['duration'] = 'Must be at least 1 minute';
  }

  const hourFields = ['openingTime', 'closingTime'];

  for (const field of hourFields) {
    if (!errors[field] && (values[field] < 0 || values[field] > 23)) {
      errors[field] = 'Invalid hour';
    }
  }

  const dateFields = ['startDate', 'endDate'];

  for (const field of dateFields) {
    if (!errors[field] && (requiredFields.includes(field) || Boolean(values[field]))) {
      if (!(values[field] instanceof Date)) {
        errors[field] = 'Invalid date';
      } else if (field === 'endDate' && values.endDate < values.startDate) {
        errors[field] = 'End date should be later than start date';
      }
    }
  }

  if (values.website && !websiteUrl.test(values.website)) {
    errors.website = 'Must be a valid URL';
  }
  if (values.facebook && !facebookUrl.test(values.facebook)) {
    errors.facebook = 'Must be a valid Facebook URL';
  }
  if (values.twitter && !twitterUrl.test(values.twitter)) {
    errors.twitter = 'Must be a valid Twitter URL';
  }

  if (values.refundType === 'percent') {
    if (values.refundAmount < 0 || values.refundAmount > 100) {
      errors.refundAmount = 'Cancellation fee (%) must be between 0 and 100';
    }
  }

  if (values.refundType === 'amount') {
    if (values.refundAmount < 0) {
      errors.refundAmount = "Cancellation fee can't be lower than or equal to 0";
    }
  }

  if (values.refundType !== 'none') {
    if (values.refundDuration < 1) {
      errors.refundDuration = 'Refund duration must be at least 1';
    }
  } else {
    errors.refundDuration = null;
    errors.refundAmount = null;
  }

  return errors;
}

export default withFormik({
  mapPropsToValues: ({ service }) => ({
    category: (service && service.category) || '',
    title: (service && service.title) || '',
    subtitle: (service && service.subtitle) || '',
    description: (service && service.description) || '',
    duration: (service && service.duration) || '30',
    rules: (service && service.rules) || [],
    start: (service && service.start) || '',
    end: (service && service.end) || '',
    facebook: (service && service.facebook) || '',
    twitter: (service && service.twitter) || '',
    website: (service && service.website) || '',
    basePrice: service && service.basePrice != null ? service.basePrice : '',
    acceptETH: (service && service.acceptETH) || false,
    availableDays: (service && service.dayList) || [],
    startDate: (service && service.startDate) || '',
    endDate: (service && service.endDate) || '',
    openingTime: service && service.openingTime != null ? service.openingTime : null,
    closingTime: service && service.closingTime != null ? service.closingTime : null,
    externalUrl: (service && service.externalUrl) || '',
    slots: service && service.slots != null ? service.slots : '',
    location:
      (service &&
        service.location && {
          ...service.location,
          address_components: [{ long_name: service.location.line1 }],
        }) ||
      {},
    postalCode: (service && service.location && service.location.postalCode) || '',
    city: (service && service.location && service.location.city) || '',
    state: (service && service.location && service.location.state) || '',
    countryCode: (service && service.location && service.location.countryCode) || '',
    latlong:
      (service &&
        service.location &&
        service.location.geo &&
        service.location.geo.coordinates && {
          lat: service.location.geo.coordinates[1],
          lng: service.location.geo.coordinates[0],
        }) ||
      null,
    tags: (service && service.tags && service.tags.map(tag => tag._id || tag)) || [],
    media: (service && service.media) || [],
    formattedAddress:
      (service && service.location && service.location.formattedAddress) || undefined,
    refundType: 'none',
    ...(service &&
    service.periods[0].cancellationPolicies &&
    service.periods[0].cancellationPolicies.length > 0
      ? {
          refundType: service.periods[0].cancellationPolicies[0].refundType,
          refundDuration: Math.round(service.periods[0].cancellationPolicies[0].duration / 24 / 60), // Minutes to days
          refundAmount: service.periods[0].cancellationPolicies[0].refundAmount,
        }
      : { refundType: 'none' }),
  }),
  validate,
  validateOnChange: false,
  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
  enableReinitialize: true,
})(ServiceForm);
