import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Input from 'shared_components/StyledInput';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { media } from 'libs/styled';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { geocodeByPlaceId } from 'libs/placesAutocomplete';
import { parseLocationData } from 'libs/location';
import SingleImageUploader from './components/SingleImageUploader';
import TagSelector from 'shared_components/TagSelector';
import InlineInput from 'shared_components/InlineInput';
import { parseTags } from 'libs/fetch_helpers';
import { error, backgroundDark, primary } from 'libs/colors';

const Label = styled.label`
  display: grid;
  grid-template-columns: 1fr 4fr;
`;

const FieldName = styled.span`
  font-weight: bold;
  font-size: 22px;
  font-weight: 700;
  margin: auto 0;
  grid-column: 1 / 6;
  ${media.minMediumPlus} {
    grid-column: 1 / 2;
  }
`;

const Field = styled.span`
  grid-column: 1 / 6;
  ${media.minMediumPlus} {
    grid-column: 2 / 6;
    margin-left: 20px;
    max-width: 400px;
  }
`;

const FieldDesc = styled.span`
  font-style: italic;
  font-size: 14px;
  margin-left: 10px;
  grid-column: 1 / 6;
`;

const FieldAndDesc = styled.span`
  grid-column: 1 / 6;
`;

const FormField = styled.div`
  margin-bottom: 25px;
`;

const FullWidthField = styled.div`
  grid-column: 1 / 6;
`;

const GeneralSettings = ({
  trip,
  editTrip,
  deleteTrip,
  cloneTrip,
  suggestedTags,
  selectTags,
  tags,
}) => {
  const [selectedTags, setSelectedTags] = useState(parseTags(trip.tags.map(tag => tags[tag])));

  useEffect(
    () => {
      setSelectedTags(parseTags(trip.tags.map(tag => tags[tag])));
    },
    [tags, trip.tags],
  );

  const updateTitle = event => {
    editTrip({
      title: event.target.value,
    });
  };
  const changeAddress = (type, formattedAddress, placeId) => {
    const key = type === 'initial' ? 'userStartLocation' : 'userEndLocation';
    geocodeByPlaceId(placeId).then(results => {
      const currentResult = results[0];
      const { countryCode, city, state } = parseLocationData(currentResult);
      const { lat, lng } = currentResult.geometry.location;
      const geo = {
        type: 'Point',
        coordinates: [lng(), lat()],
      };

      editTrip({
        [key]: {
          countryCode,
          city,
          state,
          geo,
          formattedAddress,
        },
      });
    });
  };
  const onChangeDescription = description => {
    editTrip({
      description,
    });
  };
  return (
    <div>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Name</Trans>
          </FieldName>
          <Field>
            <Input
              onBlur={updateTitle}
              wrapperStyle={{ marginTop: '10px' }}
              defaultValue={trip.title}
            />
          </Field>
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Start Location</Trans>
          </FieldName>
          <Field>
            <I18n>
              {({ i18n }) => (
                <SemanticLocationControl
                  onChange={(formattedAddress, placeId) =>
                    changeAddress('initial', formattedAddress, placeId)
                  }
                  useStyledInput
                  inputProps={{
                    placeholder: i18n._(t`Type an address`),
                    wrapperStyle: {
                      marginTop: '10px',
                    },
                  }}
                  defaultAddress={trip.userStartLocation && trip.userStartLocation.formattedAddress}
                />
              )}
            </I18n>
          </Field>
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>End Location</Trans>
          </FieldName>
          <Field>
            <I18n>
              {({ i18n }) => (
                <SemanticLocationControl
                  onChange={(formattedAddress, placeId) =>
                    changeAddress('end', formattedAddress, placeId)
                  }
                  useStyledInput
                  inputProps={{
                    placeholder: i18n._(t`Type an address`),
                    wrapperStyle: {
                      marginTop: '10px',
                    },
                  }}
                  defaultAddress={trip.userEndLocation && trip.userEndLocation.formattedAddress}
                />
              )}
            </I18n>
          </Field>
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldAndDesc>
            <FieldName>
              <Trans>Tags</Trans>
            </FieldName>
            <FieldDesc>
              <Trans>Enter up to 8 tags</Trans>
            </FieldDesc>
          </FieldAndDesc>
          <TagSelector
            onChange={selectTags}
            selectedTags={selectedTags}
            suggestedTags={suggestedTags}
          />
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldAndDesc>
            <FieldName>
              <Trans>Cover Image</Trans>
            </FieldName>
            <FieldDesc>
              <Trans>Recommended 1920x1080px</Trans>
            </FieldDesc>
          </FieldAndDesc>
          <FullWidthField>
            <SingleImageUploader trip={trip} editTrip={editTrip} />
          </FullWidthField>
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Description</Trans>
          </FieldName>
          <FullWidthField style={{ marginTop: 10 }}>
            <InlineInput useTextarea hideIcon onChanged={onChangeDescription}>
              {trip.description}
            </InlineInput>
          </FullWidthField>
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Other Actions</Trans>
          </FieldName>
          <FullWidthField>
            <div
              style={{
                fontSize: '16px',
                marginTop: 10,
                padding: 10,
                border: `1px dashed ${backgroundDark}`,
              }}
            >
              <span
                onClick={() => cloneTrip(trip)}
                style={{ cursor: 'pointer', color: primary, marginRight: 20 }}
              >
                Duplicate Trip
              </span>
              <span onClick={deleteTrip} style={{ cursor: 'pointer', color: error }}>
                Delete Trip
              </span>
            </div>
          </FullWidthField>
        </Label>
      </FormField>
    </div>
  );
};

export default GeneralSettings;
