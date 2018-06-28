import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { media } from 'libs/styled';
import AddToTripButton from './AddToTripButton';

const GridContainer = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 12px;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  margin-bottom: 24px;

  ${media.minSmall} {
    grid-template-columns: 150px 150px;
  }
`;

const ErrorMsgDiv = styled.div`
  grid-column: span 2;
  justify-self: start;
`;

const SuccessMessage = styled(Link)`
  color: #5fb79e;
  align-self: flex-end;
  margin-top: 25px;

  :hover {
    color: #4ac4a1;
  }
`;

const WarningMessage = styled(Link)`
  color: #f57c00;
  align-self: flex-end;
  margin-top: 25px;

  :hover {
    color: #ff9800;
  }
`;

function ServiceActionButtons(props) {
  return (
    <GridContainer>
      <AddToTripButton
        myUnpurchasedTrips={props.myUnpurchasedTrips}
        onTripClick={props.onAddServiceToTrip}
        onNewTripClick={props.onAddServiceToNewTrip}
      />
      <Button icon labelPosition="right" color="blue">
        Book Now
        <Icon name="shop" />
      </Button>
      <ErrorMsgDiv>
        {props.serviceRecentlyAddedToTrip && (
          <SuccessMessage to={`/trips/${props.serviceRecentlyAddedToTrip.objectId}`}>
            Added to <b>{props.serviceRecentlyAddedToTrip.title}</b>
            <Icon name="check circle outline" />
          </SuccessMessage>
        )}
        {props.serviceAlreadyAddedToTrip && (
          <WarningMessage to={`/trips/${props.serviceAlreadyAddedToTrip.objectId}`}>
            Already added to <b>{props.serviceAlreadyAddedToTrip.title}</b>
          </WarningMessage>
        )}
      </ErrorMsgDiv>
    </GridContainer>
  );
}

ServiceActionButtons.propTypes = {
  myUnpurchasedTrips: PropTypes.array,
  onAddServiceToTrip: PropTypes.func.isRequired,
  onAddServiceToNewTrip: PropTypes.func.isRequired,
  serviceRecentlyAddedToTrip: PropTypes.object,
  serviceAlreadyAddedToTrip: PropTypes.object,
};

export default ServiceActionButtons;
