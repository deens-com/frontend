import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { media } from 'libs/styled';
import I18nText from 'shared_components/I18nText';
import AddToTripButton from 'shared_components/AddToTripButton';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  margin-bottom: 24px;
  row-gap: 10px;

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
      />
      <Button
        icon
        labelPosition="right"
        color="blue"
        onClick={props.onBookNowClick}
        target="_blank"
        rel="noopener noreferrer"
        as="button"
      >
        Book Now
        <Icon name="shop" />
      </Button>
      {props.externalUrl && (
        <Button
          icon
          labelPosition="right"
          target="_blank"
          rel="noopener noreferrer"
          as="a"
          href={props.externalUrl}
        >
          Read More
          <Icon name="world" />
        </Button>
      )}
      <ErrorMsgDiv>
        {props.serviceRecentlyAddedToTrip && (
          <SuccessMessage
            to={`/trips/organize/${props.isLoggedIn ? props.serviceRecentlyAddedToTrip._id : ''}`}
          >
            Added to{' '}
            <b>
              {props.isLoggedIn ? (
                <I18nText data={props.serviceRecentlyAddedToTrip.title} />
              ) : (
                'trip'
              )}
            </b>
            <Icon name="check circle outline" />
          </SuccessMessage>
        )}
        {props.serviceAlreadyAddedToTrip && (
          <WarningMessage to={`/trips/organize/${props.serviceAlreadyAddedToTrip._id}`}>
            Already added to{' '}
            <b>
              <I18nText data={props.serviceAlreadyAddedToTrip.title} />
            </b>
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
