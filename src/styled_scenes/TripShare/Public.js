import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';
import { H2, H3, P, PStrong } from 'libs/commonStyles';
import TripCard from 'shared_components/Carts/Trip';
import InlineInput from 'shared_components/InlineInput';
import { primary, disabled } from 'libs/colors';
import apiClient from 'libs/apiClient';
import ShareData from './ShareData';
import Button from 'shared_components/Button';
import { formatMedia } from 'libs/trips';
import FieldValidator from './FieldValidator';
import { Loader } from 'semantic-ui-react';
import { PRIVACY_PUBLIC } from 'libs/trips';
import step1 from './1.png';
import step2 from './2.png';
import step3 from './3.png';

const TripEdit = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 190px 285px 1fr;
  margin-top: 20px;
  text-align: left;
`;

const Fields = styled.div`
  grid-column: 1 / 2;
`;

const Card = styled.div`
  grid-column: 2 / 3;
  position: relative;
`;

const LoaderWrapper = styled.div`
  position: absolute;
  margin-top: 80px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
`;

const Description = styled.div`
  grid-column: 3 / 4;
  font-size: 16px;
`;

const Steps = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 25px;
`;
const Step = styled.div`
  > img {
    width: 106px;
    height: 106px;
  }
  text-align: center;
`;

const StepNumber = styled.div`
  padding: 3px;
  background-color: ${primary};
  border-radius: 3px 3px 3px 0;
  color: white;
  width: 30px;
  height: 30px;
  margin: auto;
  margin-top: 10px;
`;

const StepText = styled.div`
  margin-top: 10px;
`;

function addLang(text) {
  return {
    en: text,
  };
}

const Public = ({ trip, publishTrip, patchTrip, isPatchingTrip }) => {
  const [editedTrip, setTrip] = useState(trip);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [imgSize, setImgSize] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const tagsResponse = await apiClient.tags.get();
      setSuggestedTags(
        tagsResponse.data.map(tag => ({
          ...tag,
          value: tag.names,
        })),
      );
    };
    fetchData();
  }, []);

  const someImg = editedTrip.media && editedTrip.media[0];

  useEffect(
    () => {
      const getImgSize = () => {
        if (!editedTrip.media || !editedTrip.media[0]) {
          return {};
        }
        const img = new Image();
        img.onload = function() {
          setImgSize({
            width: img.width,
            height: img.height,
          });
        };
        img.src = editedTrip.media[0].files.original.url;
      };
      getImgSize();
    },
    [editedTrip.media, someImg],
  );

  useEffect(
    () => {
      const checkBeforeUnload = event => {
        if (trip.privacy !== PRIVACY_PUBLIC) {
          event.returnValue = `Are you sure you want to leave?`;
        }
      };
      window.addEventListener('beforeunload', checkBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', checkBeforeUnload);
      };
    },
    [trip.privacy],
  );

  const onTagsChange = tags => {
    patchTrip(trip._id, {
      tags: tags.map(tag => tag._id),
    });
    setTrip({
      ...editedTrip,
      tags,
    });
  };

  const onTitleChange = title => {
    patchTrip(trip._id, {
      title: addLang(title),
    });
    setTrip({
      ...editedTrip,
      title,
    });
  };

  const onDescriptionChange = description => {
    patchTrip(trip._id, {
      description: addLang(description),
    });
    setTrip({
      ...editedTrip,
      description,
    });
  };

  const onFileSelect = async e => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    setIsUploading(true);
    await uploadImage(file);
    setIsUploading(false);
  };

  const uploadImage = async file => {
    const uploadedFile = await apiClient.media.post(file);

    const url = uploadedFile.data.url;
    const newMedia = formatMedia(url);
    patchTrip(trip._id, {
      media: newMedia,
    });

    setTrip({
      ...editedTrip,
      media: newMedia,
    });
  };

  const validateTitle = () => {
    if (editedTrip.title.length < 5) {
      return [-1, `${editedTrip.title.length}/5 characters`];
    }
    if (editedTrip.title.length > 60) {
      return [-1, `${editedTrip.title.length}/60 characters`];
    }
    const text = `${editedTrip.title.length} characters`;
    if (editedTrip.title.length >= 40 && editedTrip.title.length <= 45) {
      return [1, text];
    }
    return [0, text];
  };

  const validateDescription = () => {
    const desc = editedTrip.description || '';
    const words = (desc.trim().match(/ /g) || []).length;
    if (words < 30) {
      return [-1, `${words}/30 words`];
    }
    if (words > 500) {
      return [-1, `${words}/500 words`];
    }
    const text = `${words} words`;
    if (words >= 150 && words <= 200) {
      return [1, text];
    }
    return [0, text];
  };

  const validateTags = () => {
    if (editedTrip.tags.length < 1) {
      return [-1, 'No tags'];
    }
    if (editedTrip.tags.length > 8) {
      return [-1, `${editedTrip.tags.length}/8 tags`];
    }
    if (editedTrip.tags.length === 4 || editedTrip.tags.length === 5) {
      return [1, `${editedTrip.tags.length} tags`];
    }
    return [0, `${editedTrip.tags.length} tags`];
  };

  const validateMedia = () => {
    if (!imgSize.width || editedTrip.media.length === 0 || !editedTrip.media[0].files) {
      return [-1, 'None'];
    }
    const size = `${imgSize.width}x${imgSize.height}`;
    if (
      imgSize.width < 1280 ||
      imgSize.width > 3840 ||
      imgSize.height < 720 ||
      imgSize.height > 2160
    ) {
      return [-1, size];
    }
    return [1, size];
  };

  const isAllValid = () => {
    const validations = [validateTitle(), validateDescription(), validateMedia(), validateTags()];
    return !validations.some(validation => validation[0] === -1);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Prompt
        when={trip.privacy !== PRIVACY_PUBLIC}
        message={`Your trip is not published yet. Are you sure you want to leave?`}
      />
      <H2>Please review your trip</H2>
      <TripEdit>
        <Fields>
          <FieldValidator
            title="Title"
            validatorFunction={validateTitle}
            recommended="Ideally 40-45 characters"
          />
          <FieldValidator
            title="Description"
            validatorFunction={validateDescription}
            recommended="Ideally 150-200 words"
          />
          <FieldValidator
            title="Media"
            validatorFunction={validateMedia}
            dependesOn={imgSize}
            recommended="Ideally 1920x1080 px"
          />
          <FieldValidator
            title="Tags"
            validatorFunction={validateTags}
            recommended="Ideally 4-5 & fast booking"
          />
        </Fields>
        <Card>
          {isUploading && (
            <LoaderWrapper>
              <Loader active size="medium" />
            </LoaderWrapper>
          )}
          <TripCard
            item={editedTrip}
            isPlaceholder={false}
            isTrip
            editMode
            suggestedTags={suggestedTags}
            onTagsChange={onTagsChange}
            onTitleChange={onTitleChange}
            onFileSelect={onFileSelect}
          />
        </Card>
        <Description>
          <InlineInput
            iconColor={primary}
            useTextarea
            autoexpand
            onChanged={onDescriptionChange}
            placeholder="Write a description"
          >
            {editedTrip.description}
          </InlineInput>
        </Description>
      </TripEdit>
      {trip.privacy === PRIVACY_PUBLIC && !isPatchingTrip ? (
        <div style={{ display: 'flex' }}>
          <ShareData small title="Your trip is published!" trip={trip} />
          <div style={{ borderLeft: `1px solid ${disabled}`, paddingLeft: '25px' }}>
            <H2>Earn money creating trips for travelers</H2>
            <Steps>
              <Step>
                <img src={step1} alt="Traveler asks for help" />
                <StepNumber>
                  <H3 style={{ marginTop: '-3px' }}>1</H3>
                </StepNumber>
                <StepText>
                  <PStrong>Traveler</PStrong>
                  <P>Asks for help</P>
                </StepText>
              </Step>
              <Step>
                <img src={step2} alt="You plan their trip" />
                <StepNumber>
                  <H3 style={{ marginTop: '-3px' }}>2</H3>
                </StepNumber>
                <StepText>
                  <PStrong>You</PStrong>
                  <P>Plan their trip</P>
                </StepText>
              </Step>
              <Step>
                <img src={step2} alt="You get paid" />
                <StepNumber>
                  <H3 style={{ marginTop: '-3px' }}>3</H3>
                </StepNumber>
                <StepText>
                  <PStrong>You</PStrong>
                  <P>Get paid</P>
                </StepText>
              </Step>
            </Steps>
            <Button theme="primaryFilled" type="link" href="/earn-money">
              Learn More
            </Button>
          </div>
        </div>
      ) : (
        <Button
          disabled={isPatchingTrip || !isAllValid()}
          theme="primaryFilled"
          onClick={publishTrip}
        >
          {isPatchingTrip ? <Loader size="tiny" active inline="centered" /> : 'Publish my trip'}
        </Button>
      )}
    </div>
  );
};

Public.propTypes = {
  trip: PropTypes.object,
  publishTrip: PropTypes.func.isRequired,
  patchTrip: PropTypes.func.isRequired,
  isPatchingTrip: PropTypes.bool,
};

export default Public;
