import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { media } from 'libs/styled';
import I18nText from 'shared_components/I18nText';
import AddToTripButton from 'shared_components/AddToTripButton';
import urls from 'libs/urlGenerator';

// i18n
import { Trans } from '@lingui/macro';

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
        <Trans>Book Now</Trans>
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
          <Trans>Read More</Trans>
          <Icon name="world" />
        </Button>
      )}
      <ErrorMsgDiv>
        {props.serviceRecentlyAddedToTrip && (
          <SuccessMessage to={urls.trip.organize(props.serviceRecentlyAddedToTrip._id)}>
            <Trans>Added to</Trans>{' '}
            <b>
              {props.isLoggedIn ? (
                <I18nText data={props.serviceRecentlyAddedToTrip.title} />
              ) : (
                <Trans>trip</Trans>
              )}
            </b>
            <Icon name="check circle outline" />
          </SuccessMessage>
        )}
        {props.serviceAlreadyAddedToTrip && (
          <WarningMessage to={urls.trip.organize(props.serviceAlreadyAddedToTrip._id)}>
            <Trans>Already added to</Trans>{' '}
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
  service: PropTypes.object.isRequired,
  myUnpurchasedTrips: PropTypes.array,
  onAddServiceToTrip: PropTypes.func.isRequired,
  onAddServiceToNewTrip: PropTypes.func.isRequired,
  serviceRecentlyAddedToTrip: PropTypes.object,
  serviceAlreadyAddedToTrip: PropTypes.object,
  onBookNowClick: PropTypes.func.isRequired,
};

export default ServiceActionButtons;
