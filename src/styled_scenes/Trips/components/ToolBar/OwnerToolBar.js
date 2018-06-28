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
  grid-template-columns: ${({ isMobile }) => (isMobile ? '1fr' : '2fr 1fr 1fr 1fr')};
  grid-row-gap: 15px;
  grid-column-gap: ${({ isMobile }) => (isMobile ? '0' : '15px')};
  width: 100%;
`;

const TitleDiv = styled.div`
  grid-column: span 1;
`;
const LocationDiv = styled.div`
  grid-column: span ${({ isMobile }) => (isMobile ? '1' : '3')};
`;
const StartDateDiv = styled.div`
  & > div {
    height: 100%;
  }
`;
const EndDateDiv = styled.div`
  grid-column: span ${({ isMobile }) => (isMobile ? '1' : '2')};
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
        <GridFormContainer display="grid" onSubmit={onSubmit} isMobile={isMobile}>
          <TitleDiv isMobile={isMobile}>
            <FormControl
              type="text"
              placeholder="Name of the Trip"
              onChange={value => {
                onValueChange('title', value);
              }}
              onBlur={onSubmit}
              value={state.title}
            />
          </TitleDiv>
          <LocationDiv isMobile={isMobile}>
            <LocationControl
              formatted_address={state.formattedAddress}
              onSelect={(address, placeId) => {
                onValueChange('formattedAddress', address);
                geocodeByPlaceId(placeId)
                  .then(results => getLatLng(results[0]))
                  .then(latlng => onValueChange('latlng', latlng))
                  .catch(console.error);
              }}
              onBlur={onSubmit}
            />
          </LocationDiv>
          <StartDateDiv isMobile={isMobile}>
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
              onBlur={onSubmit}
            />
          </StartDateDiv>
          <EndDateDiv isMobile={isMobile}>
            <FormControl
              onChange={value => {
                onValueChange('endDate', value);
              }}
              value={state.endDate}
              dayPickerProps={{ disabledDays: { before: state.startDate || new Date() } }}
              type="date"
              placeholder="To date"
              leftIcon="date"
              onBlur={onSubmit}
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
              onBlur={onSubmit}
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
