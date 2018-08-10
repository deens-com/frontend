// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';

// COMPONENTS
import Col from '../../../shared_components/layout/Col';
import Row from '../../../shared_components/layout/Row';
import TripCart from '../../../shared_components/Carts/Trip';
import Button from '../../../shared_components/Button';
import Day, { Header } from './Day';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';
import { tripsData } from '../../../data/home';

// STYLES
import { Highlight } from './styles';

const Wrap = styled.div`
  padding: 45px 10px 10px;

  min-height: 112px;
  overflow: auto;

  ${media.minMedium} {
    padding: 25px;
  }
`;

// MODULE
export default function Results({
  trip,
  showDetails,
  scheduledServices,
  onServiceDragEnd,
  onServiceRemoveClick,
  expanded,
  toggleExpansion,
}) {
  const allowServiceRearrange = false; // trip && (trip.owner && trip.owner.objectId) === (currentUser && currentUser.id) && !trip.booked;
  const dayProps = { trip, allowServiceRearrange, onServiceRemoveClick, expanded, toggleExpansion };
  const services = [];
  if (showDetails) {
    services.push(...scheduledServices.map(day => <Day key={day.day} day={day} {...dayProps} />));
  }
  return (
    <Wrap>
      {!showDetails && (
        <Header>
          <h4>
            Most popular trips to <Highlight>New York</Highlight>
          </h4>
          <Button
            type="button"
            round
            size="small"
            theme="mainFilled"
            onClick={ev => {
              alert('Creating your event');
            }}
            text="Create your own trip"
          />
        </Header>
      )}
      {showDetails ? (
        <DragDropContext onDragEnd={onServiceDragEnd}>{services}</DragDropContext>
      ) : (
        <Row>
          {tripsData.map(item => (
            <Col key={item.title} xsBasis="50%" lgBasis="25%">
              <TripCart item={item} />
            </Col>
          ))}
        </Row>
      )}
    </Wrap>
  );
}

// Props Validation
Results.propTypes = {
  trip: PropTypes.object,
  showDetails: PropTypes.bool,
  scheduledServices: PropTypes.array,
  onServiceDragEnd: PropTypes.func.isRequired,
  onServiceRemoveClick: PropTypes.func.isRequired,
  expanded: PropTypes.object.isRequired,
  toggleExpansion: PropTypes.func.isRequired,
};

Results.defaultProps = {
  scheduledServices: [],
};
