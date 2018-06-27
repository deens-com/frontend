import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Form from 'shared_components/Form';

const GridFormContainer = styled(Form)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  width: 100%;
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
  return <GridFormContainer>Owner</GridFormContainer>;
}

export default OwnerToolBar;
