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

export function generateDaysArray(numberOfDays, services, inDayServices, prevDays = []) {
  const days = [];

  for (let i = 0; i < numberOfDays; i++) {
    const key = prevDays[i] ? prevDays[i].key : ObjectID().str;
    days.push({ services: [], key });
  }

  if (services) {
    services.forEach(serviceId => {
      const service = inDayServices[serviceId];
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

const denormalizeServices = (trip, services, inDayServices, selectedOptions) => {
  return trip.services.map(sId => ({
    ...inDayServices[sId],
    ...(inDayServices[sId].selectedOption
      ? { selectedOption: selectedOptions[inDayServices[sId].selectedOption] }
      : {}),
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
  selectedOptions,
}) => {
  const numberOfDays = minutesToDays(trip.duration);
  const [days, setDays] = useState(() =>
    generateDaysArray(numberOfDays, trip.services, inDayServices),
  );
  const [dragging, setDragging] = useState(null);
  const [servicesByDay, setServicesByDay] = useState(() =>
    denormalizeServices(trip, services, inDayServices, selectedOptions),
  );

  useEffect(
    () => {
      setServicesByDay(denormalizeServices(trip, services, inDayServices, selectedOptions));
    },
    [trip, services, inDayServices, selectedOptions],
  );

  useEffect(
    () => {
      setDays(prevDays => generateDaysArray(numberOfDays, trip.services, inDayServices, prevDays));
    },
    [numberOfDays, trip.services, inDayServices],
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
            selectedOptions={selectedOptions}
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
