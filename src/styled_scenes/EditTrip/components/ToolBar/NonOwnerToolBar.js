import React from 'react';
import styled from 'styled-components';

import Form from 'shared_components/Form';
import FormControl from 'shared_components/Form/FormControl';
import ToolbarButton from './ToolbarButton';
import toolBarPropTypes from './toolbar-proptypes';
import ResponsiveToolbarWrap from './ResponsiveToolBarWrap';

const GridFormContainer = styled(Form)`
  display: grid;
  grid-template-columns: ${({ isMobile }) => (isMobile ? '1fr' : '4fr 1fr 1fr')};
  grid-row-gap: ${({ isMobile }) => (isMobile ? '15px' : '0')};
  grid-column-gap: ${({ isMobile }) => (isMobile ? '0' : '15px')};
  width: 100%;
`;

const StartDateDiv = styled.div`
  & > div {
    height: 100%;
  }
`;

function NonOwnerToolBar({ state, onValueChange, onCheckAvailabilityClick, serviceAvailabilityCheckInProgress }) {
  return (
    <ResponsiveToolbarWrap>
      {({ isMobile }) => (
        <GridFormContainer isMobile={isMobile}>
          <StartDateDiv>
            <FormControl
              onChange={value => {
                onValueChange('startDate', value);
              }}
              value={state.startDate}
              dayPickerProps={{ disabledDays: { before: new Date() } }}
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
            onCheckAvailibilityClick={onCheckAvailabilityClick}
            serviceAvailabilityCheckInProgress={serviceAvailabilityCheckInProgress}
          />
        </GridFormContainer>
      )}
    </ResponsiveToolbarWrap>
  );
}

NonOwnerToolBar.propTypes = toolBarPropTypes;

export default NonOwnerToolBar;
