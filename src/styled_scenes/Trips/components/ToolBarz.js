// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete';
import { Input } from 'semantic-ui-react';

// COMPONENTS
import Form from '../../../shared_components/Form';
import FormControl from '../../../shared_components/Form/FormControl';
import MobileFilter from './MobileFilter';
import LocationControl from 'shared_components/Form/LocationControl';

// ACTIONS/CONFIG
import { sizes, media } from '../../../libs/styled';
import ToolbarButton from './ToolbarButton';

// STYLES

const Wrap = styled.div`
  border-bottom: 1px solid #eef1f4;
  padding: 10px;
  // height: 65px;
  display: flex;
  background: #ffffff;
  width: 100%;
  z-index: 18;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);

  ${media.minSmall} {
    height: 70px;
  }

  ${media.minMedium} {
    height: 95px;
    padding: 25px;
    height: auto;
    position: static;
    width: auto;
    z-index: 0;
    box-shadow: none;
  }

  > div,
  > form > div {
    margin-right: 15px;
  }
`;

const GridFormContainer = styled(Form)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  width: 100%;
`;

const TitleDiv = styled.div`
  grid-column: span 2;
`;
const LocationDiv = styled.div`
  grid-column: span 3;
`;
const StartDateDiv = styled.div``;
const EndDateDiv = styled.div`
  grid-column: span 2;
`;

// MODULE
export default function ToolBar({
  state,
  trip,
  onSubmit,
  onValueChange,
  showTripUpdated,
  onCheckAvailabilityClick,
  serviceAvailabilityCheckInProgress,
  isOwner,
}) {
  return (
    <Wrap>
      <GridFormContainer display="grid" onSubmit={onSubmit}>
        <TitleDiv>
          <Input type="text" placeholder="Name of the Trip" value={trip.title} fluid />
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
              disabledDays: { before: new Date(), after: isOwner ? state.endDate : undefined }, // if it's the owner of the trip then make sure he selects a startDate less than the endDate, else remove validation
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
      </GridFormContainer>
    </Wrap>
  );
}

function old({
  state,
  onSubmit,
  onValueChange,
  showTripUpdated,
  onCheckAvailabilityClick,
  serviceAvailabilityCheckInProgress,
  isOwner,
}) {
  return (
    <Media query={`(max-width: ${sizes.small})`}>
      {matches =>
        matches ? (
          <Wrap mobile>
            <MobileFilter state={state} onSubmit={onSubmit} onValueChange={onValueChange} />
          </Wrap>
        ) : (
          <Wrap>
            <Form display="flex" onSubmit={onSubmit}>
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

              {isOwner ? (
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
              ) : null}
              <FormControl
                onChange={value => {
                  onValueChange('person', value);
                }}
                value={state.person}
                type="person"
                placeholder="2"
                leftIcon="person"
              />
              <ToolbarButton
                showSaveButton={isOwner}
                showTripUpdated={showTripUpdated}
                onCheckAvailibilityClick={onCheckAvailabilityClick}
                serviceAvailabilityCheckInProgress={serviceAvailabilityCheckInProgress}
              />
            </Form>
          </Wrap>
        )
      }
    </Media>
  );
}

// Props Validation
ToolBar.propTypes = {
  trip: PropTypes.object,
  showTripUpdated: PropTypes.bool,
  onCheckAvailabilityClick: PropTypes.func.isRequired,
  serviceAvailabilityCheckInProgress: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
};
