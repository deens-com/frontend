import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { minutesToDays } from 'libs/Utils';
import Day from './Day';
import ObjectID from 'bson-objectid';
import arrayMove from 'array-move';
import Map from './Map';
import EmptyDay from './Day/EmptyDay';
import { media } from 'libs/styled';

export function generateDaysArray(numberOfDays, inDayServices, prevDays = []) {
  const days = [];

  for (let i = 0; i < numberOfDays; i++) {
    const key = prevDays[i] ? prevDays[i].key : ObjectID().str;
    days.push({ services: [], key });
  }

  if (inDayServices) {
    Object.entries(inDayServices).forEach(([id, service]) => {
      const i = service.day - 1;
      if (days[i]) {
        days[i] = {
          ...days[i],
          services: [...days[i].services, service],
        };
      }
    });
  }

  return days;
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  ${media.minSmall} {
    flex-direction: row;
  }
`;

const Days = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 40px 0;
  flex: 1;
`;

const denormalizeServices = (trip, services, inDayServices) => {
  return trip.services.map(sId => ({
    ...inDayServices[sId],
    service: services[inDayServices[sId].service],
  }));
};

const Itinerary = ({
  services,
  goToAddService,
  removeDay,
  summaryView,
  addNewDay,
  changeServicePosition,
  changeDayPosition,
  selectOption,
  selectTransport,
  showingMap,
  saveDayNote,
  trip,
  inDayServices,
  transports,
}) => {
  const numberOfDays = minutesToDays(trip.duration);
  const [days, setDays] = useState(() => generateDaysArray(numberOfDays, inDayServices));
  const [dragging, setDragging] = useState(null);
  const [servicesByDay, setServicesByDay] = useState(() =>
    denormalizeServices(trip, services, inDayServices),
  );

  useEffect(
    () => {
      setServicesByDay(denormalizeServices(trip, services, inDayServices));
    },
    [trip, services, inDayServices],
  );

  useEffect(
    () => {
      if (numberOfDays !== days.length) {
        setDays(generateDaysArray(numberOfDays, inDayServices, days));
      }
    },
    [numberOfDays, inDayServices, days],
  );

  const startDragging = useCallback((day, id, position) => {
    setDragging({ id, position, day });
  }, []);

  const onChange = useCallback((day, position) => {
    setDragging({ position, day });
  }, []);

  const endDragging = useCallback(() => {
    setDragging(null);
  }, []);

  const changeDayPositionFn = useCallback(
    (currentDay, nextDay) => {
      setDays(arrayMove(days, currentDay - 1, nextDay - 1));
      changeDayPosition(currentDay, nextDay);
    },
    [days, changeDayPosition],
  );

  //<Droppable droppableId={itineraryDroppablePrefix} direction="vertical" type={types.DAY}>
  return (
    <Wrapper>
      <Map numberOfDays={numberOfDays} showingMap={showingMap} services={servicesByDay} />
      <Days>
        {days.map((day, index) => (
          <Day
            inDayServices={inDayServices}
            addNewDay={addNewDay}
            summaryView={summaryView}
            key={day.key}
            id={day.key}
            dayServices={day.services}
            day={index + 1}
            services={services}
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
            isLastDay={index + 1 === days.length}
            saveDayNote={saveDayNote}
            trip={trip}
            transports={transports}
            servicesByDay={servicesByDay}
          />
        ))}
        <EmptyDay addNewDay={addNewDay} day={days.length + 1} tripStartDate={trip.startDate} />
      </Days>
    </Wrapper>
  );
};

Itinerary.propTypes = {
  services: PropTypes.objectOf(
    PropTypes.shape({
      service: PropTypes.object, //we should create proptypes for services
    }),
  ).isRequired,
  trip: PropTypes.shape({
    startDate: PropTypes.string,
    duration: PropTypes.number,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.object, //we should create proptypes for services
      }),
    ),
  }),
  addNewDay: PropTypes.func.isRequired,
  changeServicePosition: PropTypes.func.isRequired,
  changeDayPosition: PropTypes.func.isRequired,
  goToAddService: PropTypes.func.isRequired,
  removeDay: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
  summaryView: PropTypes.bool,
  showingMap: PropTypes.bool,
  saveDayNote: PropTypes.func.isRequired,
};

Itinerary.defaultProps = {
  summaryView: false,
};

export default Itinerary;
