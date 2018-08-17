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
const serviceTypes = [
  { label: i18n.t('places.singular'), value: 'place' },
  { label: i18n.t('activities.singular'), value: 'activity' },
  { label: i18n.t('foods.singular'), value: 'food' },
];
const serviceTypeDropdownOptions = serviceTypes.map(text => ({
  value: text.value,
  text: text.label,
}));
const hours = Array.from({ length: 24 }, (v, k) => k);
const hoursDropdownOptions = hours.map(h => ({
  value: h,
  text: h.toString().padStart(2, '0') + ':00',
}));
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
          {touched.pricePerSession &&
            errors.pricePerSession && <ErrorMsg>{errors.pricePerSession}</ErrorMsg>}
        </Form.Field>

        {/* Available Days */}
        <Form.Group grouped>
          <Form.Field required>
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
            {touched.availableDays &&
              errors.availableDays && <ErrorMsg>{errors.availableDays}</ErrorMsg>}
          </Form.Field>
        </Form.Group>

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
  // exception: smart contracts doesn't accept price with a floating point, therefor we should accept round numbers only
  if (!Number.isInteger(parseFloat(values['pricePerSession']))) {
    errors['pricePerSession'] = 'Invalid number';
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
    type: (service && service.type) || null,
    name: (service && service.name) || '',
    description: (service && service.description) || '',
    pricePerSession: service && service.pricePerSession != null ? service.pricePerSession : '',
    acceptETH: (service && service.acceptETH) || false,
    availableDays: (service && service.DayList && new Set(service.DayList)) || new Set(),
    openingTime: service && service.openingTime != null ? service.openingTime : null,
    closingTime: service && service.closingTime != null ? service.closingTime : null,
    slots: service && service.slots != null ? service.slots : '',
    latlong:
      (service &&
        service.latitude &&
        service.longitude && { lat: service.latitude, lng: service.longitude }) ||
      null,
    tags: (service && service.tags) || [],
    formattedAddress: (service && service.formattedAddress) || undefined,
    media: (service && service.media) || [],
  }),
  validate,
  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
  enableReinitialize: true,
})(ServiceForm);
