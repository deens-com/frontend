import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form, Modal, Message, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import styled from 'styled-components';
import serviceTags from './service-tags';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { Link } from 'react-router-dom';
import history from './../../main/history';
import { isMobile, checkRequiredFields } from 'libs/Utils';
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

const tagsDropdownOptions = serviceTags.map(value => ({ text: value, value }));

const ErrorMsg = styled.div`
  color: red;
`;

const AddRuleContainer = styled.div`
  margin-bottom: 15px;
`;

const RulesLabel = styled.label`
  font-weight: bold;
`;

const facebookUrl = /^(?:(?:https?):\/\/)?(?:www.)?((facebook\.com)|(fb\.me))\/(#?\/?[a-zA-Z0-9#]+)+\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const twitterUrl = /^(?:(?:https?):\/\/)?(?:www.)?((twitter\.com))\/(#?\/?[a-zA-Z0-9#]+)+\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const websiteUrl = /^(?:(?:https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceId: null,
    };
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    submitInFlight: PropTypes.bool.isRequired,
    globalError: PropTypes.object,
    userProfile: PropTypes.object,
    submitButtonText: PropTypes.string,
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

  onUploadedFilesChanged = mediaUrls => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('media', true);
    setFieldValue('media', mediaUrls);
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

  redeploy = (values, serviceId) => {
    this.props.resetErrors();
    this.setState({ showGlobalError: false });
    this.props.onRedeployContract(values, serviceId);
  };

  addRule = e => {
    e.preventDefault();
    this.props.setFieldValue('rules', [...this.props.values.rules, '']);
  };

  removeRule = (index, e) => {
    e.preventDefault();
    this.props.setFieldValue('rules', this.props.values.rules.filter((_, i) => i !== index));
  };

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
      userProfile,
      service,
    } = this.props;

    const defaultProps = {
      onChange: handleChange,
      onBlur: handleBlur,
    };

    const userHasConnectedWallet =
      userProfile && (userProfile.ledgerPublicAddress || userProfile.metamaskPublicAddress);

    const serviceHasContract = service && service.contractAddress != null;

    // we're using the key prop over here because we want to re-create the form component once we get the service
    return (
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
            <Button
              color="green"
              onClick={() => this.redeploy(this.props.values, this.state.serviceId)}
            >
              Re-deploy
            </Button>
            <Button color="red" onClick={this.handleModalClose}>
              Close
            </Button>
          </Modal.Actions>
        </Modal>

        {/* Title */}
        <Form.Field required>
          <label>Service name</label>
          <Form.Input
            name="title"
            placeholder="Service name"
            value={values.title}
            error={!!(touched.title && errors.title)}
            {...defaultProps}
          />
          {touched.title && errors.title && <ErrorMsg>{errors.title}</ErrorMsg>}
        </Form.Field>

        {/* Subtitle */}
        <Form.Field required>
          <label>Service subtitle</label>
          <Form.Input
            name="subtitle"
            placeholder="Service subtitle"
            value={values.subtitle}
            error={!!(touched.subtitle && errors.subtitle)}
            {...defaultProps}
          />
          {touched.subtitle && errors.subtitle && <ErrorMsg>{errors.subtitle}</ErrorMsg>}
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

        {/* Service Category */}
        <Form.Field required>
          <label>Service category</label>
          <Dropdown
            name="category"
            placeholder="Service Category"
            selection
            value={values.category}
            options={serviceTypeDropdownOptions}
            onChange={this.onDropDownChange}
            error={!!(touched.category && errors.category)}
          />
          {touched.category && errors.category && <ErrorMsg>{errors.category}</ErrorMsg>}
        </Form.Field>

        {/* Price */}
        <Form.Field required>
          <label>Price Per {values.category === 'Accommodation' ? 'Night' : 'Day'}</label>
          <Form.Input
            name="basePrice"
            value={values.basePrice}
            error={!!(touched.basePrice && errors.basePrice)}
            {...defaultProps}
          />
          {touched.basePrice && errors.basePrice && <ErrorMsg>{errors.basePrice}</ErrorMsg>}
        </Form.Field>

        {/* Available Days */}
        <Form.Group grouped>
          <Form.Field required>
            <label>Available Days</label>
            <Dropdown
              name="availableDays"
              placeholder="Select davailable days"
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

        {/* Duration */}
        {values.category !== 'Accommodation' && (
          <DurationInput
            onChange={this.changeDuration}
            onTouch={this.handleDurationTouch}
            defaultValue={Number(values.duration) || undefined}
            touched={touched.duration}
            error={errors.duration}
            ErrorComponent={ErrorMsg}
          />
        )}

        {/* Location search */}
        <Form.Field required>
          <label>Location</label>
          <SemanticLocationControl
            defaultAddress={values.formattedAddress}
            onKeyUp={this.onLocationKeyUp}
            onChange={this.onLocationSelect}
            onlyCities
          />
          {touched.latlong && errors.latlong && <ErrorMsg>{errors.latlong}</ErrorMsg>}
        </Form.Field>

        {/* Instruction */}
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Instructions Before Service</label>
            <Form.Input
              name="start"
              value={values.start}
              error={!!(touched.start && errors.start)}
              {...defaultProps}
            />
            {touched.start && errors.start && <ErrorMsg>{errors.start}</ErrorMsg>}
          </Form.Field>
          <Form.Field required>
            <label>Instructions After Service</label>
            <Form.Input
              name="end"
              value={values.end}
              error={!!(touched.end && errors.end)}
              {...defaultProps}
            />
            {touched.end && errors.end && <ErrorMsg>{errors.end}</ErrorMsg>}
          </Form.Field>
        </Form.Group>

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

        {/* Period date */}
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Start date</label>
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
            <label>End date</label>
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
            {touched.openingTime && errors.openingTime && <ErrorMsg>{errors.openingTime}</ErrorMsg>}
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
            {touched.closingTime && errors.closingTime && <ErrorMsg>{errors.closingTime}</ErrorMsg>}
          </Form.Field>
        </Form.Group>

        {/* Slots in a Day */}
        <Form.Field required>
          <label>
            Number of slots available per {values.category === 'Accommodation' ? 'Night' : 'Day'}
          </label>
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

        {/* Tags */}
        <Form.Field>
          <label>Tags</label>
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
          <label>Service Images</label>
          <MultiImageUploader
            value={values.media}
            onUploadedFilesChanged={this.onUploadedFilesChanged}
            initialUploadedFiles={values.media}
          />
        </Form.Field>

        {/* Accept Ethereum */}
        {isMobile ? null : userHasConnectedWallet ? (
          <Message info>
            <Message.Header>Deploy smart contract and accept payments in Ethereum</Message.Header>
            <Message.Content>
              <br />
              <Form.Field>
                <Form.Checkbox
                  id="acceptETH"
                  name="acceptETH"
                  checked={values.acceptETH}
                  {...defaultProps}
                  label="Yes, deploy service as a smart contract"
                  disabled={serviceHasContract}
                />
                {serviceHasContract && (
                  <span>
                    * Can't update the service smart contract once contract has been deployed
                  </span>
                )}
                {!service &&
                  userProfile.ledgerPublicAddress && (
                    <p>
                      Before clicking submit, make sure you are connected on the Ethereum app in
                      your Ledger and that it's not on standby mode
                    </p>
                  )}
              </Form.Field>
            </Message.Content>
          </Message>
        ) : (
          !service && (
            <Message info>
              <Message.Header>Deploy smart contract and accept payments in Ethereum</Message.Header>
              <br />
              <Message.Content>
                If you want to deploy a smart contract and accept payments in Ethereum, you should
                connect your account with Ledger or MetaMask. <br />
                <br />
                <strong>
                  <Link to="/account/settings">Click here</Link>
                </strong>{' '}
                to continue to your settings page where you can connect your preferred wallet.
              </Message.Content>
            </Message>
          )
        )}

        <Form.Button disabled={submitInFlight}>{this.props.submitButtonText}</Form.Button>
      </Form>
    );
  }
}

function validate(values) {
  const requiredFields = [
    'category',
    'title',
    'subtitle',
    'description',
    'start',
    'end',
    'duration',
    'basePrice',
    'availableDays',
    'startDate',
    'endDate',
    'slots',
    'latlong',
  ];

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
    if (!errors[field]) {
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
    tags: (service && service.tags.map(tag => tag._id || tag)) || [],
    media: (service && service.media) || [],
    formattedAddress:
      (service && service.location && service.location.formattedAddress) || undefined,
  }),
  validate,
  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
  enableReinitialize: true,
})(ServiceForm);
