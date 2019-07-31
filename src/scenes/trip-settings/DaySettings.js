import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Input from 'shared_components/StyledInput';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { Trans, t } from '@lingui/macro';
import { error, backgroundDark } from 'libs/colors';
import InlineInput from 'shared_components/InlineInput';
import MultiImageUploader from 'shared_components/MultiImageUploader/MultiImageUploader';
import apiClient from 'libs/apiClient';

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

const DaySettings = ({ editTrip, trip, day, deleteDay }) => {
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

  const onUploadedFilesChanged = async (mediaUrls, id, hero, url) => {
    setUploadingImages(num => num - 1);
    const newImg = mediaUrls.find(img => img.id === id);

    if (!newImg) {
      await editTrip({
        media: media.filter(file => file.files.original.url !== url),
      });
      return;
    }

    await apiClient.media.trips.post(
      {
        url: newImg.url,
        day,
        hero: false,
      },
      trip._id,
    );
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
              {trip.notes && trip.notes[day] && trip.notes[day].en}
            </InlineInput>
          </div>
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Media</Trans>
          </FieldName>
          <MultiImageUploader
            value={media}
            onUploadedFilesChanged={onUploadedFilesChanged}
            initialUploadedFiles={media || []}
            onStartedUpload={onStartedUpload}
          />
        </Label>
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
