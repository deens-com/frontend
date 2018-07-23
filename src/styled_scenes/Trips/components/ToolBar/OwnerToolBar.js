import React, { Component } from 'react';
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
export default class OwnerToolBar extends Component {
  static propTypes = toolBarPropTypes;

  onLocationSelect = async (address, placeId) => {
    const { onValueChange } = this.props;
    onValueChange('formattedAddress', address);
    const results = await geocodeByPlaceId(placeId);
    const currentResult = results[0];
    const latlngPromise = getLatLng(currentResult);
    const { address_components: addressComponents } = currentResult;
    const localities = addressComponents.filter(
      c => c.types.includes('locality') || c.types.includes('postal_town'),
    );
    const countries = addressComponents.filter(c => c.types.includes('country'));
    if (countries[0] && countries[0].long_name) {
      onValueChange('country', countries[0].long_name);
    }
    if (localities[0] && localities[0].long_name) {
      onValueChange('city', localities[0].long_name);
    }
    const latlng = await latlngPromise;
    onValueChange('latlng', latlng);
  };

  render() {
    const {
      state,
      onSubmit,
      onValueChange,
      onCheckAvailabilityClick,
      serviceAvailabilityCheckInProgress,
    } = this.props;
    const isTripBooked = true; // trip && trip.booked;
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
                value={state.title || ''}
                disabled={isTripBooked}
              />
            </TitleDiv>
            <LocationDiv isMobile={isMobile}>
              <LocationControl
                formatted_address={state.formattedAddress}
                onSelect={this.onLocationSelect}
                onBlur={onSubmit}
                disabled={isTripBooked}
              />
            </LocationDiv>
            <StartDateDiv isMobile={isMobile}>
              <FormControl
                onChange={value => {
                  onValueChange('startDate', value);
                  setTimeout(onSubmit, 0);
                }}
                value={state.startDate}
                dayPickerProps={{
                  disabledDays: { before: new Date(), after: state.endDate }, // if it's the owner of the trip then make sure he selects a startDate less than the endDate, else remove validation
                }}
                type="date"
                placeholder="From date"
                leftIcon="date"
                disabled={isTripBooked}
              />
            </StartDateDiv>
            <EndDateDiv isMobile={isMobile}>
              <FormControl
                onChange={value => {
                  onValueChange('endDate', value);
                  setTimeout(onSubmit, 0);
                }}
                value={state.endDate}
                dayPickerProps={{ disabledDays: { before: state.startDate || new Date() } }}
                type="date"
                placeholder="To date"
                leftIcon="date"
                disabled={isTripBooked}
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
                disabled={isTripBooked}
              />
            </div>
            <ToolbarButton
              showSaveButton={true}
              onCheckAvailibilityClick={onCheckAvailabilityClick}
              serviceAvailabilityCheckInProgress={serviceAvailabilityCheckInProgress}
            />
          </GridFormContainer>
        )}
      </ResponsiveToolbarWrap>
    );
  }
}
