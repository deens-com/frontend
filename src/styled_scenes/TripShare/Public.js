import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';
import { isIosDevice } from 'libs/Utils';
import { H2, H3, P, PStrong } from 'libs/commonStyles';
import TripCard from 'shared_components/Carts/Trip';
import InlineInput from 'shared_components/InlineInput';
import { primary, disabled, error } from 'libs/colors';
import apiClient from 'libs/apiClient';
import ShareData from './ShareData';
import Button from 'shared_components/Button';
import { formatMedia, uploadTripImage } from 'libs/trips';
import FieldValidator from './FieldValidator';
import { Loader } from 'semantic-ui-react';
import { PRIVACY_PUBLIC } from 'libs/trips';
import step1 from './1.png';
import step2 from './2.png';
import step3 from './3.png';
import { media } from 'libs/styled';
import { Popup } from 'semantic-ui-react';

const TripEdit = styled.div`
  margin-top: 20px;
  margin-bottom: 25px;
  text-align: left;
  display: flex;
  flex-direction: column;
  ${media.minSmall} {
    display: grid;
    column-gap: 10px;
    row-gap: 0;
    grid-template-columns: 190px 285px 1fr;
    grid-template-rows: 1fr fit-content(60px);
  }
`;

const Title = styled(H2)`
  display: none;
  ${media.minSmall} {
    display: block;
  }
`;

const Fields = styled.div`
  order: 3;
  margin: auto;
  margin-top: 40px;
  ${media.minSmall} {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    margin: 0;
  }
`;

const Card = styled.div`
  position: relative;
  ${media.minSmall} {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
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
  font-size: 16px;
  ${media.minSmall} {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
  }
`;

const Errors = styled.div`
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  color: ${error};
  text-align: center;
  font-weight: bold;
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

const EarnMoney = styled.div`
  border-left: 1px solid ${disabled};
  padding-left: 25px;
  display: none;
  ${media.minSmall} {
    display: block;
  }
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
    if (validateTags(tags)[0] !== -1) {
      patchTrip(trip._id, {
        tags: tags.map(tag => tag._id),
      });
    }

    setTrip({
      ...editedTrip,
      tags,
    });
  };

  const onTitleChange = title => {
    if (validateTitle(title)[0] !== -1) {
      patchTrip(trip._id, {
        title: addLang(title),
      });
    }

    setTrip({
      ...editedTrip,
      title,
    });
  };

  const onDescriptionChange = description => {
    if (validateDescription(description)[0] !== -1) {
      patchTrip(trip._id, {
        description: addLang(description),
      });
    }

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
    const url = await uploadTripImage(file);
    const newMedia = formatMedia(url);

    const img = new Image();
    img.onload = function() {
      setImgSize({
        width: img.width,
        height: img.height,
      });

      if (
        validateMedia({
          width: img.width,
          height: img.height,
        })[0] !== -1
      ) {
        patchTrip(trip._id, {
          media: newMedia,
        });
      }

      setTrip({
        ...editedTrip,
        media: newMedia,
      });
    };
    img.src = url;
  };

  const validateTitle = titleToValid => {
    const title = typeof titleToValid !== 'undefined' ? titleToValid : editedTrip.title;
    if (title.length < 5) {
      return [-1, `${title.length}/5 characters`, 'your title is too short'];
    }
    if (title.length > 60) {
      return [-1, `${title.length}/60 characters`, 'your title is too long'];
    }
    const text = `${title.length} characters`;
    if (title.length >= 40 && title.length <= 45) {
      return [1, text];
    }
    return [0, text];
  };

  const validateDescription = descToValid => {
    const description = typeof descToValid !== 'undefined' ? descToValid : editedTrip.description;
    const desc = description || '';
    const words = (desc.trim().match(/ /g) || []).length + 1;
    if (words < 30) {
      return [-1, `${words}/30 words`, 'your description is too short'];
    }
    if (words > 500) {
      return [-1, `${words}/500 words`, 'your description is too long'];
    }
    const text = `${words} words`;
    if (words >= 150 && words <= 200) {
      return [1, text];
    }
    return [0, text];
  };

  const validateTags = tagsToValid => {
    const tags = typeof tagsToValid !== 'undefined' ? tagsToValid : editedTrip.tags;
    if (tags.length < 1) {
      return [-1, 'No tags', 'your need to add some tags'];
    }
    if (tags.length > 8) {
      return [-1, `${tags.length}/8 tags`, 'you can only add 8 tags'];
    }
    if (tags.length === 4 || tags.length === 5) {
      return [1, `${tags.length} tags`];
    }
    return [0, `${tags.length} tags`];
  };

  const validateMedia = imgSizeToValid => {
    const size = typeof imgSizeToValid !== 'undefined' ? imgSizeToValid : imgSize;
    if (!size.width || editedTrip.media.length === 0 || !editedTrip.media[0].files) {
      return [-1, 'None'];
    }
    const sizeText = `${size.width}x${size.height}`;
    if (size.width < 1280 || size.height < 720) {
      return [-1, sizeText, 'your image has to be bigger than 1280x720.'];
    }
    if (size.width > 3840 || size.height > 2160) {
      return [0, sizeText];
    }
    return [1, sizeText];
  };

  const getErrors = () => {
    const validations = [
      { name: 'title', val: validateTitle() },
      { name: 'description', val: validateDescription() },
      { name: 'tags', val: validateTags() },
      { name: 'media', val: validateMedia() },
    ];
    return validations.filter(validation => validation.val[0] === -1);
  };

  const errors = getErrors();

  return (
    <div style={{ textAlign: 'center' }}>
      <Prompt
        when={trip.privacy !== PRIVACY_PUBLIC}
        message={`Your trip is not published yet. Are you sure you want to leave?`}
      />
      <Title>Please review your trip</Title>
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
            recommended={
              <span>
                Ideally 4-5 &{' '}
                <Popup
                  position="bottom center"
                  onOpen={() => {
                    if (isIosDevice) {
                      document.body.style.cursor = 'pointer';
                    }
                  }}
                  onClose={() => {
                    if (isIosDevice) {
                      document.body.style.cursor = 'initial';
                    }
                  }}
                  trigger={<span style={{ cursor: 'pointer', color: primary }}>fast booking</span>}
                >
                  If at least half of the services in your trip are bookable in Deens.
                </Popup>
              </span>
            }
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
        {trip.privacy === PRIVACY_PUBLIC &&
          errors.length > 0 &&
          !isPatchingTrip && (
            <Errors>
              Sorry,{' '}
              {errors
                .map(err => {
                  return err.val[2] || '';
                })
                .join(', ')}
              .
            </Errors>
          )}
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
          <EarnMoney>
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
                <img src={step3} alt="You get paid" />
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
          </EarnMoney>
        </div>
      ) : (
        <Button
          disabled={isPatchingTrip || errors.length > 0}
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
