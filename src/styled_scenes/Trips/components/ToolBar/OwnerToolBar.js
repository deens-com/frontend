import React from 'react';
import styled from 'styled-components';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';

import Form from 'shared_components/Form';
import FormControl from 'shared_components/Form/FormControl';
import LocationControl from 'shared_components/Form/LocationControl';
import ToolbarButton from './ToolbarButton';
import toolBarPropTypes from './toolbar-proptypes';
import ResponsiveToolbarWrap from './ResponsiveToolBarWrap';

const GridFormContainer = styled(Form)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  width: 100%;
  grid-row-gap: 20px;
`;

const TitleDiv = styled.div`
  grid-column: span 2;
`;
const LocationDiv = styled.div`
  grid-column: span 3;
`;
const StartDateDiv = styled.div`
  & > div {
    height: 100%;
  }
`;
const EndDateDiv = styled.div`
  grid-column: span 2;
  & > div {
    height: 100%;
  }
`;

function OwnerToolBar({
  state,
  trip,
  onSubmit,
  onValueChange,
  showTripUpdated,
  onCheckAvailabilityClick,
  serviceAvailabilityCheckInProgress,
}) {
  return (
    <ResponsiveToolbarWrap>
      {({ isMobile }) => (
        <GridFormContainer display="grid" onSubmit={onSubmit}>
          <TitleDiv>
            <FormControl
              type="text"
              placeholder="Name of the Trip"
              onChange={value => {
                onValueChange('title', value);
              }}
              value={state.title}
            />
          </TitleDiv>
          <LocationDiv>
            <LocationControl
              formatted_address={state.formattedAddress}
              onSelect={(address, placeId) => {
                onValueChange('formattedAddress', address);
                geocodeByPlaceId(placeId)
                  .then(results => getLatLng(results[0]))
                  .then(latlng => onValueChange('latlng', latlng))
                  .catch(console.error);
              }}
            />
          </LocationDiv>
          <StartDateDiv>
            <FormControl
              onChange={value => {
                onValueChange('startDate', value);
              }}
              value={state.startDate}
              dayPickerProps={{
                disabledDays: { before: new Date(), after: state.endDate }, // if it's the owner of the trip then make sure he selects a startDate less than the endDate, else remove validation
              }}
              type="date"
              placeholder="From date"
              leftIcon="date"
            />
          </StartDateDiv>
          <EndDateDiv>
            <FormControl
              onChange={value => {
                onValueChange('endDate', value);
              }}
              value={state.endDate}
              dayPickerProps={{ disabledDays: { before: state.startDate || new Date() } }}
              type="date"
              placeholder="To date"
              leftIcon="date"
            />
          </EndDateDiv>
          <div>
            <FormControl
              onChange={value => {
                onValueChange('person', value);
              }}
              value={state.person}
              type="person"
              placeholder="2"
              leftIcon="person"
            />
          </div>
          <ToolbarButton
            showSaveButton={true}
            showTripUpdated={showTripUpdated}
            onCheckAvailibilityClick={onCheckAvailabilityClick}
            serviceAvailabilityCheckInProgress={serviceAvailabilityCheckInProgress}
          />
        </GridFormContainer>
      )}
    </ResponsiveToolbarWrap>
  );
}

OwnerToolBar.propTypes = toolBarPropTypes;

export default OwnerToolBar;
