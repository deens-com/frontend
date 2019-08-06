import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Input from 'shared_components/StyledInput';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { Trans, t } from '@lingui/macro';
import { error, backgroundDark } from 'libs/colors';
import InlineInput from 'shared_components/InlineInput';
import MultiImageUploader from './components/MultiImageUploader';
import apiClient from 'libs/apiClient';
import I18nText from 'shared_components/I18nText';

const Label = styled.label``;

const FieldName = styled.span`
  font-weight: bold;
  font-size: 22px;
  font-weight: 700;
`;

const FieldDesc = styled.span`
  font-style: italic;
  font-size: 14px;
  margin-left: 10px;
`;

const FormField = styled.div`
  margin-bottom: 25px;
`;

function addLang(text) {
  return {
    en: text,
  };
}

const DaySettings = ({ updateMedia, editTrip, trip, day, deleteDay }) => {
  const media = useMemo(() => trip.media.filter(media => media.day === day), [day, trip.media]);
  const [uploadingImages, setUploadingImages] = useState(0);

  const onChangeNote = text => {
    const note = addLang(text);
    editTrip({
      notes: {
        ...trip.notes,
        [day]: note,
      },
    });
  };

  const onUploadedFile = async url => {
    setUploadingImages(num => num - 1);

    await updateMedia({
      url: url,
      day,
      hero: false,
      type: 'image',
    });
  };

  const onRemovedFile = async index => {
    await editTrip({
      media: media.filter((_, i) => i !== index),
    });
  };

  const onStartedUpload = () => {
    setUploadingImages(num => num + 1);
  };

  return (
    <div>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Description</Trans>
          </FieldName>
          <div style={{ marginTop: 10 }}>
            <InlineInput
              useTextarea
              hideIcon
              onChanged={onChangeNote}
              placeholder={<Trans>Write a description for this day</Trans>}
            >
              {I18nText.translate(trip.notes && trip.notes[day])}
            </InlineInput>
          </div>
        </Label>
      </FormField>
      <FormField>
        <FieldName>
          <Trans>Media</Trans>
        </FieldName>
        <MultiImageUploader
          media={media}
          onUploadedFile={onUploadedFile}
          onRemovedFile={onRemovedFile}
          onStartedUpload={onStartedUpload}
          uploading={uploadingImages}
        />
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Other Actions</Trans>
          </FieldName>
          <div style={{ marginTop: 10, padding: 10, border: `1px dashed ${backgroundDark}` }}>
            <span
              onClick={() => deleteDay(day)}
              style={{ cursor: 'pointer', color: error, fontSize: '16px' }}
            >
              Delete Day
            </span>
          </div>
        </Label>
      </FormField>
    </div>
  );
};

export default DaySettings;
