import React from 'react';
import styled from 'styled-components';

import Form from 'shared_components/Form';
import FormControl from 'shared_components/Form/FormControl';
import ToolbarButton from './ToolbarButton';
import toolBarPropTypes from './toolbar-proptypes';

const GridFormContainer = styled(Form)`
  display: grid;
  grid-template-columns: 4fr 1fr 1fr;
  width: 100%;
`;

const StartDateDiv = styled.div`
  & > div {
    height: 100%;
  }
`;

function NonOwnerToolBar({
  state,
  onValueChange,
  showTripUpdated,
  onCheckAvailabilityClick,
  serviceAvailabilityCheckInProgress,
}) {
  return (
    <GridFormContainer>
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
        showSaveButton={false}
        showTripUpdated={showTripUpdated}
        onCheckAvailibilityClick={onCheckAvailabilityClick}
        serviceAvailabilityCheckInProgress={serviceAvailabilityCheckInProgress}
      />
    </GridFormContainer>
  );
}

NonOwnerToolBar.propTypes = toolBarPropTypes;

export default NonOwnerToolBar;
