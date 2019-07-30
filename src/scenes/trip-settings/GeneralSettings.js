import React from 'react';
import styled from 'styled-components';
import Input from 'shared_components/StyledInput';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SingleImageUploader from './components/SingleImageUploader';
import TextArea from 'shared_components/TextArea';
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

const GeneralSettings = ({ trip, editTrip }) => {
  return (
    <div>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Name</Trans>
          </FieldName>
          <Input wrapperStyle={{ marginTop: '10px' }} defaultValue={trip.title} />
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Start Location</Trans>
          </FieldName>
          <I18n>
            {({ i18n }) => (
              <SemanticLocationControl
                onChange={(formattedAddress, placeId) => {}}
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
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>End Location</Trans>
          </FieldName>
          <I18n>
            {({ i18n }) => (
              <SemanticLocationControl
                onChange={(formattedAddress, placeId) => {}}
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
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Tags</Trans>
          </FieldName>
          <FieldDesc>
            <Trans>Enter up to 8 tags</Trans>
          </FieldDesc>
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Cover Image</Trans>
          </FieldName>
          <FieldDesc>
            <Trans>Recommended 1920x1080px</Trans>
          </FieldDesc>
          <SingleImageUploader trip={trip} editTrip={editTrip} />
        </Label>
      </FormField>
      <FormField>
        <Label>
          <FieldName>
            <Trans>Description</Trans>
          </FieldName>
          <div style={{ marginTop: 10 }}>
            <InlineInput useTextarea hideIcon onChanged={() => {}}>
              {trip.description}
            </InlineInput>
          </div>
        </Label>
      </FormField>
    </div>
  );
};

export default GeneralSettings;
