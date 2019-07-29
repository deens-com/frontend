import React from 'react';
import styled from 'styled-components';
import Input from 'shared_components/StyledInput';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SingleImageUploader from './components/SingleImageUploader';
import InlineInput from 'shared_components/InlineInput';
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

const DaySettings = ({ trip, day }) => {
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
              onChanged={() => {}}
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
          <div style={{ marginTop: 10 }}>arre</div>
        </Label>
      </FormField>
    </div>
  );
};

export default DaySettings;
