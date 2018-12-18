import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { media } from 'libs/styled';
import AddToTripButton from './AddToTripButton';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  margin-bottom: 24px;

  ${media.minSmall} {
    grid-template-columns: 160px 160px;
  }
`;

const ErrorMsgDiv = styled.div`
  grid-column: span 2;
  justify-self: start;
  margin-top: 1em;
  font-weight: bold;
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
        isLoggedIn={props.isLoggedIn}
      />
      <Button icon labelPosition="right" color="blue" onClick={props.onBookNowClick}>
        Book Now
        <Icon name="shop" />
      </Button>
      <ErrorMsgDiv>
        {props.serviceRecentlyAddedToTrip && (
          <SuccessMessage
            to={`/trips/organize/${
              props.isLoggedIn ? props.serviceRecentlyAddedToTrip.objectId : ''
            }`}
          >
            Added to <b>{props.isLoggedIn ? props.serviceRecentlyAddedToTrip.title : 'trip'}</b>
            <Icon name="check circle outline" />
          </SuccessMessage>
        )}
        {props.serviceAlreadyAddedToTrip && (
          <WarningMessage to={`/trips/organize/${props.serviceAlreadyAddedToTrip.objectId}`}>
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
  onBookNowClick: PropTypes.func.isRequired,
};

export default ServiceActionButtons;
