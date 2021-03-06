import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';
import { H2, H3, P, PStrong } from 'libs/commonStyles';
import TripCard from 'shared_components/Carts/Trip';
import InlineInput from 'shared_components/InlineInput';
import { primary, disabled, error } from 'libs/colors';
import apiClient from 'libs/apiClient';
import ShareData from './ShareData';
import Button from 'shared_components/Button';
import { formatMedia, signAndUploadImage } from 'libs/trips';
import FieldValidator from './FieldValidator';
import { Loader } from 'semantic-ui-react';
import { PRIVACY_PUBLIC } from 'libs/trips';
import step1 from './1.png';
import step2 from './2.png';
import step3 from './3.png';
import { media } from 'libs/styled';
import Popup from 'shared_components/Popup';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

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

const Public = ({ trip, publishTrip, patchTrip, isPatchingTrip, suggestedTags }) => {
  const [editedTrip, setTrip] = useState(trip);
  const [imgSize, setImgSize] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const someImg = editedTrip.media && editedTrip.media[0];

  useEffect(
    () => {
      const getImgSize = () => {
        if (!someImg) {
          return {};
        }
        const img = new Image();
        img.onload = function() {
          setImgSize({
            width: img.width,
            height: img.height,
          });
        };
        img.src = someImg.files.original.url;
      };
      getImgSize();
    },
    [someImg],
  );

  useEffect(
    () => {
      const checkBeforeUnload = event => {
        if (trip.privacy !== PRIVACY_PUBLIC) {
          event.returnValue = <Trans>Are you sure you want to leave?</Trans>;
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
    if (validateTags(tags)[0] !== -1 || trip.privacy !== PRIVACY_PUBLIC) {
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
    if (validateTitle(title)[0] !== -1 || trip.privacy !== PRIVACY_PUBLIC) {
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
    if (validateDescription(description)[0] !== -1 || trip.privacy !== PRIVACY_PUBLIC) {
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
    try {
      setImageError(null);
      const url = await signAndUploadImage(file);
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
          })[0] !== -1 ||
          trip.privacy !== PRIVACY_PUBLIC
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
    } catch (e) {
      setImageError(e.message);
    }
  };

  const validateTitle = titleToValid => {
    const title = typeof titleToValid !== 'undefined' ? titleToValid : editedTrip.title;
    if (title.length < 5) {
      return [
        -1,
        <Trans>
          {title.length}
          /5 characters
        </Trans>,
        <Trans>your title is too short</Trans>,
      ];
    }
    if (title.length > 60) {
      return [
        -1,
        <Trans>
          {title.length}
          /60 characters
        </Trans>,
        <Trans>your title is too long</Trans>,
      ];
    }
    const text = <Trans>{title.length} characters</Trans>;
    if (title.length >= 40 && title.length <= 45) {
      return [1, text];
    }
    return [0, text];
  };

  const validateDescription = descToValid => {
    const description = typeof descToValid !== 'undefined' ? descToValid : editedTrip.description;
    const desc = description || '';
    const words = (desc.trim().match(/ |\n/g) || []).length + 1;
    if (words < 30) {
      return [
        -1,
        <Trans>
          {words}
          /30 words
        </Trans>,
        <Trans>your description is too short</Trans>,
      ];
    }
    if (words > 500) {
      return [
        -1,
        <Trans>
          {words}
          /500 words
        </Trans>,
        <Trans>your description is too long</Trans>,
      ];
    }
    const text = <Trans>{words} words</Trans>;
    if (words >= 150 && words <= 200) {
      return [1, text];
    }
    return [0, text];
  };

  const validateTags = tagsToValid => {
    const tags = typeof tagsToValid !== 'undefined' ? tagsToValid : editedTrip.tags;
    if (tags.length < 1) {
      return [-1, <Trans>No tags</Trans>, <Trans>you need to add some tags</Trans>];
    }
    if (tags.length > 8) {
      return [
        -1,
        <Trans>
          {tags.length}
          /8 tags
        </Trans>,
        <Trans>you can only add 8 tags</Trans>,
      ];
    }
    if (tags.length === 4 || tags.length === 5) {
      return [1, <Trans>{tags.length} tags</Trans>];
    }
    return [0, <Trans>{tags.length} tags</Trans>];
  };

  const validateMedia = imgSizeToValid => {
    const size = typeof imgSizeToValid !== 'undefined' ? imgSizeToValid : imgSize;
    if (!size.width || editedTrip.media.length === 0 || !editedTrip.media[0].files) {
      return [-1, <Trans>None</Trans>];
    }
    const sizeText = `${size.width}x${size.height}`;
    if (size.width < 1280 || size.height < 720) {
      return [-1, sizeText, <Trans>your image has to be bigger than 1280x720.</Trans>];
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
        message={
          <span>
            <Trans>Your trip is not published yet</Trans>{' '}
            <Trans>Are you sure you want to leave?</Trans>
          </span>
        }
      />
      <Title>
        <Trans>Please review your trip</Trans>
      </Title>
      <TripEdit>
        <I18n>
          {({ i18n }) => (
            <Fields>
              <FieldValidator
                title={i18n._(t`Title`)}
                validatorFunction={validateTitle}
                recommended={i18n._(t`Ideally 40-45 characters`)}
              />
              <FieldValidator
                title={i18n._(t`Description`)}
                validatorFunction={validateDescription}
                recommended={i18n._(t`Ideally 150-200 words`)}
              />
              <FieldValidator
                title={i18n._(t`Media`)}
                validatorFunction={validateMedia}
                dependesOn={imgSize}
                recommended={i18n._(t`Ideally 1920x1080 px`)}
              />
              <FieldValidator
                title={i18n._(t`Tags`)}
                validatorFunction={validateTags}
                recommended={
                  <span>
                    <Trans>Ideally 4-5</Trans> &{' '}
                    <Popup
                      position="bottom center"
                      trigger={
                        <span style={{ cursor: 'pointer', color: primary }}>
                          <Trans>fast booking</Trans>
                        </span>
                      }
                    >
                      <Trans>
                        If at least half of the services in your trip are bookable in Deens.
                      </Trans>
                    </Popup>
                  </span>
                }
              />
            </Fields>
          )}
        </I18n>

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
              <Trans>Sorry,</Trans>{' '}
              {errors
                .map(err => {
                  return err.val[2] || '';
                })
                .join(', ')}
              .
            </Errors>
          )}
        {imageError && !isPatchingTrip && <Errors>{imageError}</Errors>}
        <Description>
          <I18n>
            {({ i18n }) => (
              <InlineInput
                iconColor={primary}
                useTextarea
                autoexpand
                onChanged={onDescriptionChange}
                placeholder={i18n._(t`Write a description`)}
              >
                {editedTrip.description}
              </InlineInput>
            )}
          </I18n>
        </Description>
      </TripEdit>
      {trip.privacy === PRIVACY_PUBLIC && !isPatchingTrip ? (
        <div style={{ display: 'flex' }}>
          <ShareData small title="Your trip is published!" trip={trip} />
          <EarnMoney>
            <H2>
              <Trans>Earn money creating trips for travelers</Trans>
            </H2>
            <Steps>
              <Step>
                <img src={step1} alt="Traveler asks for help" />
                <StepNumber>
                  <H3 style={{ marginTop: '-3px' }}>1</H3>
                </StepNumber>
                <StepText>
                  <PStrong>
                    <Trans>Traveler</Trans>
                  </PStrong>
                  <P>
                    <Trans>Asks for help</Trans>
                  </P>
                </StepText>
              </Step>
              <Step>
                <img src={step2} alt="You plan their trip" />
                <StepNumber>
                  <H3 style={{ marginTop: '-3px' }}>2</H3>
                </StepNumber>
                <StepText>
                  <PStrong>
                    <Trans>You</Trans>
                  </PStrong>
                  <P>
                    <Trans>Plan their trip</Trans>
                  </P>
                </StepText>
              </Step>
              <Step>
                <img src={step3} alt="You get paid" />
                <StepNumber>
                  <H3 style={{ marginTop: '-3px' }}>3</H3>
                </StepNumber>
                <StepText>
                  <PStrong>
                    <Trans>You</Trans>
                  </PStrong>
                  <P>
                    <Trans>Get paid</Trans>
                  </P>
                </StepText>
              </Step>
            </Steps>
            <Button theme="primaryFilled" type="link" href="/earn-money">
              <Trans>Learn More</Trans>
            </Button>
          </EarnMoney>
        </div>
      ) : (
        <Button
          disabled={isPatchingTrip || errors.length > 0}
          theme="primaryFilled"
          onClick={publishTrip}
        >
          {isPatchingTrip ? (
            <Loader size="tiny" active inline="centered" />
          ) : (
            <Trans>Publish my trip</Trans>
          )}
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
