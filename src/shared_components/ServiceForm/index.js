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
import Image from 'shared_components/Image';
import MultiImageUploader from 'shared_components/MultiImageUploader/MultiImageUploader';
import { weekdays } from 'moment';

const serviceCategories = [
  { label: i18n.t('places.singular'), value: 'place' },
  { label: i18n.t('activities.singular'), value: 'activity' },
  { label: i18n.t('foods.singular'), value: 'food' },
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
  { weekday: 'Monday', selected: false },
  { weekday: 'Tuesday', selected: false },
  { weekday: 'Wednesday', selected: false },
  { weekday: 'Thursday', selected: false },
  { weekday: 'Friday', selected: false },
  { weekday: 'Saturday', selected: false },
  { weekday: 'Sunday', selected: false },
];

const tagsDropdownOptions = serviceTags.map(value => ({ text: value, value }));

const ErrorMsg = styled.div`
  color: red;
`;

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

  onAvailableDaysChange = (e, { label, checked }) => {
    const { values, setFieldValue, setFieldTouched } = this.props;
    const availableDays = values.availableDays;
    const labelByDay = availableDays.find(day => day.weekday === label);

    if (checked) {
      // checked
      labelByDay.selected = true;
    } else {
      // unchecked
      labelByDay.selected = false;
    }
    setFieldValue('availableDays', availableDays);
    setFieldTouched('availableDays', true, false);
  };

  // onFileSelect = e => {
  //   const { setFieldValue, setFieldTouched } = this.props;
  //   const file = e.currentTarget.files[0];
  //   if (!file) return;
  //   setFieldValue('mainPicture', file);
  //   setFieldTouched('mainPicture', true, false);
  // };

  onLocationKeyUp = () => {
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

  redeploy = (values, serviceId) => {
    this.props.resetErrors();
    this.setState({ showGlobalError: false });
    this.props.onRedeployContract(values, serviceId);
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

        {/* Service Categories */}
        <Form.Field required>
          <label>Service categories</label>
          <Dropdown
            name="categories"
            placeholder="Service Category"
            selection
            multiple
            value={values.categories.map(name => name)}
            options={serviceTypeDropdownOptions}
            onChange={this.onDropDownChange}
            error={!!(touched.categories && errors.categories)}
          />
          {touched.categories && errors.categories && <ErrorMsg>{errors.categories}</ErrorMsg>}
        </Form.Field>

        {/* Price */}
        <Form.Field required>
          <label>Price Per Day/Night</label>
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
            {values.availableDays.map(availableDay => (
              <Form.Checkbox
                id={availableDay.weekday}
                label={availableDay.weekday}
                key={availableDay.weekday}
                name={availableDay.weekday}
                checked={availableDay.selected}
                onChange={this.onAvailableDaysChange}
              />
            ))}
            {touched.availableDays &&
              errors.availableDays && <ErrorMsg>{errors.availableDays}</ErrorMsg>}
          </Form.Field>
        </Form.Group>

        {/* Duration */}
        <Form.Field required>
          <label>Duration in Minutes</label>
          <Form.Input
            name="duration"
            value={values.duration}
            error={!!(touched.duration && errors.duration)}
            {...defaultProps}
          />
          {touched.duration && errors.duration && <ErrorMsg>{errors.duration}</ErrorMsg>}
        </Form.Field>

        {/* Location search */}
        <Form.Field required>
          <label>Location</label>
          <SemanticLocationControl
            defaultAddress={values.formattedAddress}
            onKeyUp={this.onLocationKeyUp}
            onChange={this.onLocationSelect}
          />
          {touched.latlong && errors.latlong && <ErrorMsg>{errors.latlong}</ErrorMsg>}
        </Form.Field>

        {/* Instruction */}
        <Form.Group widths="equal">
          <Form.Field>
            <label>Instructions Start</label>
            <Form.Input
              name="start"
              value={values.start}
              error={!!(touched.start && errors.start)}
              {...defaultProps}
            />
            {touched.start && errors.start && <ErrorMsg>{errors.start}</ErrorMsg>}
          </Form.Field>
          <Form.Field>
            <label>Instructions End</label>
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
        <Form.Field>
          <label>Rules</label>
          {values.rules.map((rule, index) => (
            <Form.Field key={`rule-${index}`}>
              <label>{`Rule ${index + 1}`}</label>
              <Form.Input
                name={`rules[${index}]`}
                value={rule}
                error={!!(touched.rule && errors.rule)}
                {...defaultProps}
              />
              {touched.rule && errors.rule && <ErrorMsg>{errors.rule}</ErrorMsg>}
            </Form.Field>
          ))}
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
          <label>Number of slots available per Day/Night</label>
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
              name="end"
              value={values.twitter}
              error={!!(touched.twitter && errors.twitter)}
              {...defaultProps}
            />
            {touched.twitter && errors.twitter && <ErrorMsg>{errors.twitter}</ErrorMsg>}
          </Form.Field>
          <Form.Field>
            <label>Website Link</label>
            <Form.Input
              name="end"
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
            options={tagsDropdownOptions}
            placeholder="Add tags"
            search
            selection
            fluid
            multiple
            value={values.tags.map(tag => tag)}
            onChange={this.onDropDownChange}
          />
        </Form.Field>

        {/* Single image upload
        <Form.Field>
          <label>Service Picture</label>
          <Flex>
            {!values.mainPicture &&
              service &&
              service.mainPicture && (
                <Image src={service.mainPicture.url} alt="service" height="43px" />
              )}
            <input
              type="file"
              name="mainPicture"
              accept=".jpg, .jpeg, .png"
              onChange={this.onFileSelect}
            />
          </Flex>
        </Form.Field>
        */}

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
    'categories',
    'title',
    'subtitle',
    'description',
    'start',
    'end',
    'duration',
    'basePrice',
    'availableDays',
    'openingTime',
    'closingTime',
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

  // exception: smart contracts doesn't accept price with a floating point, therefor we should accept round numbers only
  if (!Number.isInteger(parseFloat(values['basePrice']))) {
    errors['basePrice'] = 'Invalid number';
  }

  const hourFields = ['openingTime', 'closingTime'];

  for (const field of hourFields) {
    if (!errors[field] && (values[field] < 0 || values[field] > 23)) {
      errors[field] = 'Invalid hour';
    }
  }

  return errors;
}

export default withFormik({
  mapPropsToValues: ({ service }) => ({
    categories: (service && service.categories) || [],
    title: (service && service.title) || '',
    subtitle: (service && service.subtitle) || '',
    description: (service && service.description) || '',
    duration: (service && service.duration) || '',
    rules: (service && service.rules) || [],
    start: (service && service.start) || '',
    end: (service && service.end) || '',
    facebook: (service && service.facebook) || '',
    twitter: (service && service.twitter) || '',
    website: (service && service.website) || '',
    basePrice: service && service.basePrice != null ? service.basePrice : '',
    acceptETH: (service && service.acceptETH) || false,
    availableDays: (service && service.dayList) || weekDays,
    openingTime: service && service.openingTime != null ? service.openingTime : null,
    closingTime: service && service.closingTime != null ? service.closingTime : null,
    slots: service && service.slots != null ? service.slots : '',
    latlong:
      (service &&
        service.latitude &&
        service.longitude && { lat: service.latitude, lng: service.longitude }) ||
      null,
    tags: (service && service.tags) || [],
    media: (service && service.media) || [],
    formattedAddress: (service && service.location.formattedAddress) || undefined,
  }),
  validate,
  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
  enableReinitialize: true,
})(ServiceForm);
