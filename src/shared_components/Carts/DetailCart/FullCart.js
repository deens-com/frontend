// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button as SemanticButton } from 'semantic-ui-react';

// COMPONENTS
import PriceTag from './components/Price';
import Button from '../../Button';
import Detail from './components/Detail';
import Category from './components/Category';
import CardDescription from './components/Description';
import Thumb from '../components/Thumb';
import CopyServiceToDayButton from './components/CopyServiceToDayButton';
import EditTripContainer from 'scenes/trips/containers/EditTripContainer';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';
import Tag from './components/Tag';
import { padStart } from '../../../libs/Utils';

const Wrap = styled.div`
  ${media.minSmall} {
    display: flex;
  }
  position: relative;
`;

const CardActions = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  ${media.minSmall} {
    position: static;
    margin: 10px 0;
  }
`;

const LeftCol = styled.div`
  flex-grow: 1;
  padding: 0;
  flex-basis: 100%;
  max-width: 100%;

  ${media.minSmall} {
    flex-basis: 200px;
    max-width: 200px;
  }

  & > div {
    ${media.minSmall} {
      padding: 0;
      height: 100%;
    }
  }
`;

const ContentCol = styled.div`
  width: 100%;

  ${media.minSmall} {
    display: flex;
  }
`;

const CenterCol = styled.div`
  padding: 15px;

  ${media.minSmall} {
    flex-basis: 70%;
    min-width: 70%;
    padding: 20px;
  }

  ${media.minMedium} {
    padding: 25px;
  }
`;

const RightCol = styled.div`
  margin: 0 15px 15px 15px;
  padding-top: 15px;
  border-top: 1px solid #efeff0;
  position: relative;

  ${media.minSmall} {
    border-top: none;
    flex-basis: 30%;
    min-width: 30%;
    margin: 0;
    padding: 20px;
    text-align: right;
    display: flex;
    flex-direction: column;

    & > div:last-child {
      margin-top: auto;
      margin-bottom: 10px;
      padding-top: 10px;
    }
  }

  ${media.minMedium} {
    padding: 25px;
    flex-basis: 150px;
    max-width: 200px;
  }
`;

const HeaderRow = styled.div`
  margin-bottom: 10px;
`;

const ContentRow = styled.div``;

// MODULE
export default function FullCart({ data: service, trip, toggleExpansion, onDeleteClick, isOwner }) {
  return (
    <Wrap>
      <LeftCol>
        <Thumb url={service.media && service.media[0]} tripCount={service.partOf} withTooltip />
      </LeftCol>
      <ContentCol>
        <CenterCol>
          <HeaderRow>
            <Category category={service.type} />
            <Link to={`/services/${service.objectId}`}>
              <CardDescription description={service.name} />
            </Link>
          </HeaderRow>
          <ContentRow>
            <Detail
              block
              icon="clock"
              text={`${padStart(service.openingTime, 2)}:00 - ${padStart(
                service.closingTime,
                2,
              )}:00`}
              showEdit={isOwner}
            />
            <Detail
              block
              icon="pin"
              text={service.city + ', ' + service.country}
              showEdit={isOwner}
            />
          </ContentRow>
        </CenterCol>
        <RightCol>
          <EditTripContainer.ContextConsumer>
            {({ trip, scheduledServices, copyServiceToDay }) =>
              trip && trip.objectId && isOwner && !trip.booked ? (
                <CardActions>
                  <SemanticButton.Group basic size="medium">
                    <CopyServiceToDayButton
                      serviceId={service.objectId}
                      scheduledServices={scheduledServices}
                      copyServiceToDay={copyServiceToDay}
                    />
                    <SemanticButton
                      title="Delete service"
                      icon="trash alternate"
                      onClick={onDeleteClick}
                    />
                  </SemanticButton.Group>
                </CardActions>
              ) : null
            }
          </EditTripContainer.ContextConsumer>
          <PriceTag price={service.pricePerSession} currency={service.currency} isExpanded />
          <Button
            type="button"
            onClick={toggleExpansion}
            text="Less info"
            size="text"
            align="left"
            width="auto"
            iconAfter="arrowUp"
            theme="textGreen"
          />
        </RightCol>
      </ContentCol>
      {service.availability === true ? <Tag text="Available" backgroundColor="#4CAF50" /> : null}
      {service.availability === false ? <Tag text="Unavailable" backgroundColor="#f44336" /> : null}
    </Wrap>
  );
}

// Props Validation
FullCart.propTypes = {
  onDeleteClick: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

FullCart.defaultProps = {
  isOwner: false,
};
