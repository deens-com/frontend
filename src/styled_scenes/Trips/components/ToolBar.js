// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from 'react-media';
import Parse from 'parse';

// COMPONENTS
import Form from '../../../shared_components/Form';
import FormControl from '../../../shared_components/Form/FormControl';
import MobileFilter from './MobileFilter';

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

// MODULE
export default function ToolBar({
  state,
  onSubmit,
  onValueChange,
  trip,
  showTripUpdated,
  onCheckAvailabilityClick,
  serviceAvailabilityCheckInProgress,
}) {
  const tripOwnerId = trip && trip.owner && trip.owner.objectId;
  const currentUser = Parse.User.current();
  const showSaveButton = tripOwnerId === (currentUser && currentUser.id);

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
              <FormControl
                onChange={value => {
                  onValueChange('location', value);
                }}
                value={state.location}
                type="text"
                placeholder="Location"
                leftIcon="pin"
              />
              <FormControl
                onChange={value => {
                  onValueChange('startDate', value);
                }}
                value={state.startDate}
                dayPickerProps={{
                  disabledDays: { before: new Date(), after: showSaveButton ? state.endDate : undefined }, // if it's the owner of the trip then make sure he selects a startDate less than the endDate, else remove validation
                }}
                type="date"
                placeholder="From date"
                leftIcon="date"
              />
              {showSaveButton ? (
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
                placeholder="1"
                leftIcon="person"
              />
              <ToolbarButton
                showSaveButton={showSaveButton}
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
};
