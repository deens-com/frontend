import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { minutesToDays } from 'libs/Utils';
import Day from './Day';
import ObjectID from 'bson-objectid';
import { itineraryDroppablePrefix, types } from '../constants';
import arrayMove from 'array-move';
import Map from './Map';
import EmptyDay from './Day/EmptyDay';

export function generateDaysArray(numberOfDays) {
  const days = [];

  for (let i = 0; i < numberOfDays; i++) {
    days.push(ObjectID().str);
  }
  return days;
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
`;

const Days = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 40px 0;
  flex: 1;
`;

const Itinerary = ({
  services,
  goToAddService,
  removeDay,
  duration,
  tripStartDate,
  summaryView,
  addNewDay,
  changeServicePosition,
  changeDayPosition,
  selectOption,
  selectTransport,
  fromService,
  toService,
  showingMap,
}) => {
  const numberOfDays = minutesToDays(duration);
  const [days, setDays] = useState(generateDaysArray(numberOfDays));
  const [dragging, setDragging] = useState(null);

  if (numberOfDays !== days.length) {
    setDays(generateDaysArray(numberOfDays));
  }

  const startDragging = useCallback((day, id, position) => {
    setDragging({ id, position, day });
  });

  const onChange = useCallback((day, position) => {
    setDragging({ position, day });
  });

  const endDragging = useCallback(() => {
    setDragging(null);
  });

  const changeDayPositionFn = useCallback((currentDay, nextDay) => {
    setDays(arrayMove(days, currentDay - 1, nextDay - 1));
    changeDayPosition(currentDay, nextDay);
  });

  //<Droppable droppableId={itineraryDroppablePrefix} direction="vertical" type={types.DAY}>
  return (
    <Wrapper>
      <Map numberOfDays={numberOfDays} showingMap={showingMap} servicesByDay={services} />
      <Days>
        {days.map((dayId, index) => (
          <Day
            addNewDay={addNewDay}
            summaryView={summaryView}
            tripStartDate={tripStartDate}
            key={dayId}
            id={dayId}
            day={index + 1}
            services={services[index + 1] || []}
            changeServicePosition={changeServicePosition}
            changeDayPosition={changeDayPositionFn}
            draggingState={dragging}
            startDragging={startDragging}
            changeDragging={onChange}
            endDragging={endDragging}
            goToAddService={goToAddService}
            removeDay={removeDay}
            selectOption={selectOption}
            selectTransport={selectTransport}
            fromService={fromService}
            toService={toService}
            isLastDay={index + 1 === days.length}
          />
        ))}
        <EmptyDay addNewDay={addNewDay} day={days.length + 1} tripStartDate={tripStartDate} />
      </Days>
    </Wrapper>
  );
};

Itinerary.propTypes = {
  tripStartDate: PropTypes.string.isRequired,
  services: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.object, //we should create proptypes for services
      }),
    ),
  ).isRequired,
  duration: PropTypes.number.isRequired,
  addNewDay: PropTypes.func.isRequired,
  changeServicePosition: PropTypes.func.isRequired,
  changeDayPosition: PropTypes.func.isRequired,
  goToAddService: PropTypes.func.isRequired,
  removeDay: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
  fromService: PropTypes.object,
  toService: PropTypes.object,
  summaryView: PropTypes.bool,
  showingMap: PropTypes.bool,
};

Itinerary.defaultProps = {
  summaryView: false,
};

export default Itinerary;
