import React from 'react';
import { Link } from 'react-router-dom';
import { media } from 'libs/styled';
//import axios from 'libs/axios';
import { Loader, Dimmer } from 'semantic-ui-react';
import * as tripUtils from 'libs/trips';
import history from 'main/history';
import styled from 'styled-components';
import Input from 'shared_components/StyledInput';
import I18nText from 'shared_components/I18nText';
import Button from 'shared_components/Button';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { generateTripSlug } from 'libs/Utils';
import { getHeroImageUrlFromMedia } from 'libs/media';
import { Message } from 'semantic-ui-react';

import apiClient from 'libs/apiClient';
import analytics from 'libs/analytics';

const PageContent = styled.div`
  max-width: 825px;
  margin: 0 20px auto;
  ${media.minSmall} {
    margin: 0 auto auto;
    width: 100%;
  }
`;

const BackButton = styled(Link)`
  position: relative;
  left: -250px;
  top: 20px;
  font-size: 14px;
  color: #097da8;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  display: block;
`;

const FormInput = styled.div`
  margin-top: 20px;
`;

const Title = styled.h3`
  font-weight: bold;
`;

const Form = styled.div``;

const Content = styled.div``;

const TextArea = styled.textarea`
  border: 0;
  padding: 5px;
  outline: 0;
  font-size: 14px;
  min-height: 90px;
  width: 100%;
`;

const Publish = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const CoverImage = styled.div`
  border-radius: 5px;
  height: 162px;
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url(${props => props.url});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  > input[type='file'] {
    display: none;
  }
  > div {
    flex-shrink: 1;
  }
`;

const Required = () => <span style={{ color: 'red' }}>*</span>;

export default class Share extends React.Component {
  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.descInput = React.createRef();

    this.state = {
      isSaving: false,
      errors: {
        description: null,
        title: null,
        media: null,
        location: null,
      },
      uploadingPicture: false,
      media: null,
      location: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.trip && !state.location && !state.media) {
      return {
        location: props.trip.location,
        media: props.trip.media.length > 0 ? props.trip.media : state.media,
      };
    }
  }

  onFileSelect = async e => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    if (file.size > 3000000) {
      this.setState(prev => ({
        errors: {
          ...prev.errors,
          media: 'File size should not exceed 3 Mb',
        },
      }));
      return;
    }
    this.setState({
      uploadingPicture: true,
    });

    const uploadedFile = await apiClient.media.post(file);

    const url = uploadedFile.data.url;
    this.setState(prev => ({
      errors: {
        ...prev.errors,
        media: null,
      },
      uploadingPicture: false,
      media: [
        {
          type: 'image',
          hero: true,
          names: {
            'en-us': 'Trip image',
          },
          files: {
            original: {
              url,
            },
          },
        },
      ],
    }));
  };

  handlePublish = () => {
    const description = this.descInput.current.value;
    const title = this.nameInput.current.value;

    if (!description || !title || !this.state.media || !this.state.location) {
      this.setState({
        errors: {
          title: !title && 'You need to add a title',
          description: !description && 'You need to add a description',
          media: !this.state.media && 'You need to add an image to share your trip',
          location: !this.state.location && 'You need to add a location to share your trip',
        },
      });
      return;
    }

    analytics.trip.publish();

    this.setState({ isSaving: true }, async () => {
      const trip = {
        title: {
          'en-us': title,
        },
        description: {
          'en-us': description,
        },
        location: this.state.location,
        media: this.state.media,
        privacy: 'public',
      };

      await tripUtils.patchTrip(this.props.trip._id, trip);

      history.push(`/trips/${generateTripSlug(this.props.trip)}`);
    });
  };

  handleLocationChange = async (address, placeId) => {
    try {
      const location = await tripUtils.getLocationBasedOnPlaceId(placeId);

      this.setState(prev => ({
        location,
        errors: {
          ...prev.errors,
          location: null,
        },
      }));
    } catch (e) {
      console.error(e);
    }
  };

  isThereAnyError = () => {
    return Boolean(
      this.state.errors.media ||
        this.state.errors.title ||
        this.state.errors.location ||
        this.state.errors.description,
    );
  };

  renderContent = () => {
    const { trip } = this.props;
    const img = getHeroImageUrlFromMedia(this.state.media);

    const address = tripUtils.getFormattedAddress(this.state.location);

    return (
      <>
        {this.isThereAnyError() && (
          <Message negative>
            <Message.Header>An error occured</Message.Header>
            <p>{this.state.errors.media}</p>
            <p>{this.state.errors.title}</p>
            <p>{this.state.errors.location}</p>
            <p>{this.state.errors.description}</p>
          </Message>
        )}

        <CoverImage url={img}>
          {this.state.uploadingPicture ? (
            <Loader active inline="centered" />
          ) : (
            <React.Fragment>
              <Button
                element={({ children }) => <label htmlFor="cover-image">{children}</label>}
                onClick={e => {}}
                theme="allWhite"
                iconBefore="camera"
              >
                Change Cover
              </Button>
              <input
                id="cover-image"
                accept=".jpg, .jpeg, .png"
                type="file"
                onChange={this.onFileSelect}
              />
            </React.Fragment>
          )}
        </CoverImage>
        <Form>
          <FormInput>
            <Label>
              Review Trip Name <Required />
            </Label>
            <Input
              error={this.state.errors.title}
              innerRef={this.nameInput}
              defaultValue={I18nText.translate(trip.title)}
            />
          </FormInput>
          <FormInput>
            <Label>
              Please type the main city of your trip <Required />
            </Label>
            <SemanticLocationControl
              defaultAddress={address}
              onChange={this.handleLocationChange}
              useStyledInput
              onlyCities
            />
          </FormInput>
          <FormInput>
            <Label>
              Add a Description <Required />
            </Label>
            <Input error={this.state.errors.description}>
              <TextArea
                ref={this.descInput}
                defaultValue={trip.description && I18nText.translate(trip.description)}
              />
            </Input>
          </FormInput>
          <Publish>
            <Button onClick={this.handlePublish} theme="fillLightGreen">
              Publish Trip
            </Button>
          </Publish>
        </Form>
      </>
    );
  };

  render() {
    const { trip } = this.props;
    return (
      <PageContent>
        <Dimmer active={this.state.isSaving} page>
          <Loader size="massive" />
        </Dimmer>
        <BackButton to={`/trips/organize/${this.props.tripId}`} replace>
          Back to customization
        </BackButton>
        <Content>
          <Title>Add additional information to your trip</Title>
          {trip ? this.renderContent() : <Loader active />}
        </Content>
      </PageContent>
    );
  }
}
