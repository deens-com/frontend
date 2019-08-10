import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'semantic-ui-react';
import { DragSource, DropTarget } from 'react-dnd';
import Service from '../Service/index';
import { types } from '../../constants';
import { primary, primaryHover, error, textDisabled } from 'libs/colors';
import { H2 } from 'libs/commonStyles';
import SettingsIcon from 'shared_components/icons/Settings';
import locationIcon from 'assets/location.svg';
import locationFinishIcon from 'assets/location-finish.svg';
import Transportation from '../Transportation';
import LocationEdit from './LocationEdit';
import AddServiceBox from './AddServiceBox';
import DayTitle from 'shared_components/DayTitle';
import { TripContext } from '../..';
import { media } from 'libs/styled';
import I18nText from 'shared_components/I18nText';
import DayNote from './DayNote';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const DraggableDay = styled.div`
  background-color: white;
  display: inline-block;
  position: relative;
`;

const ServicesWrapper = styled.div`
  display: ${props => (props.hidden ? 'none' : 'flex')};
  min-height: 225px;
  margin: 0 0 64px;
`;

const Location = styled.div`
  background: white;
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 10px 0;
  position: relative;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  > img {
    margin: 0 8px 0 0;
    width: 30px;
  }

  ${media.minLargePlus} {
    display: block;
    margin: 40px 30px 0 0;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
    width: 190px;
    height: 225px;
    > img {
      width: auto;
      margin: 50px auto 20px;
      padding-left: 15px;
    }
  }
`;

const DraggingBox = styled.div`
  background-color: ${primary};
  border: 1px solid ${primaryHover};
  border-radius: 10px 10px 10px 0;
  width: 100%;
  max-width: 400px;
  > h2 {
    opacity: 0.7;
    margin-left: 30px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Services = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 0;
  justify-content: center;
  flex-direction: column;
  ${media.minLargePlus} {
    justify-content: flex-start;
    flex-direction: row;
    > div {
      margin-right: 30px;
    }
    > div {
      &:first-child {
        > div {
          margin-left: 0;
        }
      }
      &:last-child {
        > div {
          margin-right: 0;
        }
      }
    }
  }
`;

const DaySettings = styled.div`
  margin-left: 8px;
  cursor: pointer;
  font-size: 18px;
  color: ${primary} !important;
`;

const Note = styled.div`
  color: ${textDisabled};
  max-width: 700px;
`;

const Day = ({
  services,
  day,
  id,
  goToAddService,
  isNotDraggingAnyDay,
  isDraggingThisDay,
  changeServicePosition,
  draggingState,
  startDragging,
  changeDragging,
  endDragging,
  connectDropServiceTarget,
  selectedOptions,
  connectDropDayTarget,
  connectDragDayPreview,
  connectDragDaySource,
  selectOption,
  selectTransport,
  isLastDay,
  saveDayNote,
  trip,
  dayServices,
  inDayServices,
  servicesByDay,
  transports,
  onServiceDrop,
  serviceIdByDay,
}) => {
  const onAddService = useCallback(
    type => {
      goToAddService(day, type);
    },
    [goToAddService, day],
  );

  const { tripData, goToSettings, availabilities } = useContext(TripContext);

  const onGoToSettings = () => {
    goToSettings(day);
  };

  return (
    <>
      <div>
        <div>
          {isDraggingThisDay ? (
            <DraggingBox>
              <H2>
                <Trans>Day</Trans> {day}
              </H2>
            </DraggingBox>
          ) : (
            <DraggableDay>
              <TitleWrapper>
                <DayTitle day={day} tripStartDate={trip.startDate} />
                <DaySettings onClick={onGoToSettings}>
                  <SettingsIcon />
                </DaySettings>
              </TitleWrapper>
            </DraggableDay>
          )}
        </div>
        <Note>
          <DayNote note={I18nText.translate(trip.notes && trip.notes[day])} />
        </Note>
        {connectDropServiceTarget(
          <div>
            <ServicesWrapper hidden={!isNotDraggingAnyDay}>
              <Services>
                {day === 1 && (
                  <Location>
                    <img alt="Start location" src={locationIcon} />
                    <LocationEdit tripId={tripData._id} location={tripData.userStartLocation} />
                  </Location>
                )}
                {dayServices.map((data, index) => {
                  if (!inDayServices[data._id]) {
                    // this is because effect run after render
                    // so days may be outdated.
                    // bad and quick solution after 3 days of refactor
                    return null;
                  }
                  const isLast = index + 1 === services.length && isLastDay;
                  const transportKey = isLast ? `last:${data._id}` : `${data._id}`;
                  return (
                    <React.Fragment key={data._id}>
                      <Transportation
                        selectTransport={selectTransport}
                        serviceId={data._id}
                        transports={transports}
                        isFirst={index === 0 && day === 1}
                        currentTransport={transports[transportKey]}
                      >
                        <Service
                          startDraggingService={startDragging}
                          changeDraggingService={changeDragging}
                          endDraggingService={endDragging}
                          draggingState={draggingState}
                          changeServicePosition={changeServicePosition}
                          serviceIdByDay={serviceIdByDay}
                          servicesByDay={servicesByDay}
                          selectedOptions={selectedOptions}
                          onServiceDrop={onServiceDrop}
                          isFirstOfDay={index === 0}
                          isLastOfDay={index === dayServices.length - 1}
                          isLastDay={isLastDay}
                          data={{
                            ...inDayServices[data._id],
                            availability: availabilities[data._id],
                            service: services[inDayServices[data._id].service],
                          }}
                          index={index}
                          selectOption={selectOption}
                        />
                      </Transportation>
                      {isLast && (
                        <Transportation
                          key={data._id}
                          selectTransport={selectTransport}
                          serviceId={data._id}
                          transports={transports}
                          isFirst={index === 0 && day === 1}
                          isLast={isLast}
                          currentTransport={transports[`${data._id}-undefined`]}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
                <AddServiceBox day={day} goToAddService={onAddService} />
                {isLastDay && (
                  <Location>
                    <img alt="End location" src={locationFinishIcon} />
                    <LocationEdit
                      tripId={tripData._id}
                      location={tripData.userEndLocation}
                      isFinal
                    />
                  </Location>
                )}
              </Services>
            </ServicesWrapper>
          </div>,
        )}
      </div>
    </>
  );
};

Day.propTypes = {
  services: PropTypes.objectOf(
    PropTypes.shape({
      service: PropTypes.object, //we should create proptypes for services
    }),
  ).isRequired,
  day: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  draggingState: PropTypes.shape({
    day: PropTypes.number.isRequired,
    id: PropTypes.string,
    position: PropTypes.number,
  }),
  startDragging: PropTypes.func.isRequired,
  changeDragging: PropTypes.func.isRequired,
  endDragging: PropTypes.func.isRequired,
  connectDropServiceTarget: PropTypes.func.isRequired,
  connectDropDayTarget: PropTypes.func.isRequired,
  connectDragDaySource: PropTypes.func.isRequired,
  connectDragDayPreview: PropTypes.func.isRequired,
  isNotDraggingAnyDay: PropTypes.bool.isRequired,
  isDraggingThisDay: PropTypes.bool.isRequired,
  changeDayPosition: PropTypes.func.isRequired,
  goToAddService: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
  selectTransport: PropTypes.func.isRequired,
  isLastDay: PropTypes.bool.isRequired,
  saveDayNote: PropTypes.func.isRequired,
  dayMetadata: PropTypes.object,
  dayServices: PropTypes.array,
  trip: PropTypes.shape({
    startDate: PropTypes.string,
    duration: PropTypes.number,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.object, //we should create proptypes for services
      }),
    ),
  }),
};

const serviceDragAndDrop = {
  target: {
    hover(props, monitor) {
      if (monitor.getItemType() === types.SERVICE) {
        if (monitor.getItem().day !== props.day && props.services.length === 0) {
          props.changeServicePosition(
            props.draggingState.day,
            props.draggingState.position,
            props.day,
            0,
          );
          props.changeDragging(props.day, 0);
        }
        return;
      }
    },
  },
  connectTarget: connect => ({
    connectDropServiceTarget: connect.dropTarget(),
  }),
};

const dayDragAndDrop = {
  target: {
    hover(props, monitor) {
      if (monitor.getItemType() === types.DAY) {
        if (props.draggingState.day !== props.day) {
          props.changeDayPosition(props.draggingState.day, props.day);
          props.changeDragging(props.day);
        }
        return;
      }
    },
  },
  connectTarget: connect => ({
    connectDropDayTarget: connect.dropTarget(),
  }),
  source: {
    beginDrag(props) {
      props.startDragging(props.day);
      return {
        day: props.day,
        id: props.id,
      };
    },
    isDragging(props, monitor) {
      return props.id === monitor.getItem().id;
    },
    endDrag(props) {
      props.endDragging();
    },
  },
  collect: (connect, monitor) => {
    return {
      connectDragDaySource: connect.dragSource(),
      connectDragDayPreview: connect.dragPreview(),
      isDraggingThisDay: monitor.isDragging(),
      isNotDraggingAnyDay: monitor.getItemType() === types.DAY ? monitor.canDrag() : true,
    };
  },
};

export default DropTarget(types.DAY, dayDragAndDrop.target, dayDragAndDrop.connectTarget)(
  DragSource(types.DAY, dayDragAndDrop.source, dayDragAndDrop.collect)(
    DropTarget(types.SERVICE, serviceDragAndDrop.target, serviceDragAndDrop.connectTarget)(Day),
  ),
);
