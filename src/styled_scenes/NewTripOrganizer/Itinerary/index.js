import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { minutesToDays } from 'libs/Utils';
import Day from './Day';
import ObjectID from 'bson-objectid';
import { Droppable } from 'react-beautiful-dnd';
import { itineraryDroppablePrefix, types } from '../constants';

function generateDaysArray(numberOfDays) {
  const days = [];
  for (let i = 0; i < numberOfDays; i++) {
    days.push(ObjectID());
  }
  return days;
}

const Days = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px 40px 0;
`;

const Itinerary = ({ services, duration, tripStartDate, summaryView, addNewDay }) => {
  const numberOfDays = minutesToDays(duration);
  const [days, setDays] = useState(generateDaysArray(numberOfDays));
  if (numberOfDays !== days.length) {
    setDays(generateDaysArray(numberOfDays));
  }

  return (
    <Droppable droppableId={itineraryDroppablePrefix} direction="vertical" type={types.DAY}>
      {(provided, snapshot) => (
        <Days {...provided.droppableProps} ref={provided.innerRef}>
          {days.map((dayId, index) => (
            <Day
              addNewDay={addNewDay}
              summaryView={summaryView}
              tripStartDate={tripStartDate}
              key={dayId}
              id={dayId}
              day={index + 1}
              services={services[index + 1] || []}
            />
          ))}
          {provided.placeholder}
        </Days>
      )}
    </Droppable>
  );
};

Itinerary.propTypes = {
  tripStartDate: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  addNewDay: PropTypes.func.isRequired,
  summaryView: PropTypes.bool,
};

Itinerary.defaultProps = {
  summaryView: false,
};

export default Itinerary;
