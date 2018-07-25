import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EditTripForm from './EditTripForm';
import EditTripContainer from 'scenes/trips/containers/EditTripContainer';
import { media } from 'libs/styled';

const Wrap = styled.div`
  padding: 10px;

  ${media.minMedium} {
    padding: 25px;
  }
`;

const OwnerToolBar = ({ trip }) => {
  return (
    <Wrap>
      <EditTripContainer.ContextConsumer>
        {({ updateTripDetails }) => <EditTripForm trip={trip} onSubmit={updateTripDetails} />}
      </EditTripContainer.ContextConsumer>
    </Wrap>
  );
};

OwnerToolBar.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default OwnerToolBar;
