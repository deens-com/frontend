import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragSource, DropTarget } from 'react-dnd';
import Service from '../Service/index';
import { types } from '../../constants';
import { primary, primaryHover, error } from 'libs/colors';
import { H2, P } from 'libs/commonStyles';
import { Drag, TrashCan } from 'shared_components/icons';
import locationIcon from 'assets/location.svg';
import locationFinishIcon from 'assets/location-finish.svg';
import Transportation from '../Transportation';
import LocationEdit from './LocationEdit';
import AddServiceBox from './AddServiceBox';
import DayTitle from './DayTitle';
import { TripContext } from '../..';
import { media } from 'libs/styled';

const DraggableDay = styled.div`
  background-color: white;
  display: inline-block;
  position: relative;
`;

const ServicesWrapper = styled.div`
  display: ${props => (props.hidden ? 'none' : 'flex')};
  min-height: 225px;
  margin: 10px 0 64px;
`;

const Location = styled.div`
  background: white;
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 10px 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
  width: 190px;
  height: 260px;
  margin: 40px 30px 0 0;
  position: relative;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  > img {
    margin: 50px auto 20px;
    padding-left: 15px;
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
  margin-top: -40px;
  justify-content: center;
  > div > div {
    margin-right: 30px;
    margin-top: 40px;
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
  ${media.minSmall} {
    justify-content: flex-start;
  }
`;

const DeleteDay = styled.div`
  margin-left: 8px;
  cursor: pointer;
  > svg {
    fill: ${error} !important;
    height: 0.8em;
    width: 0.8em;
  }
`;

const Day = ({
  services,
  day,
  id,
  removeDay,
  goToAddService,
  tripStartDate,
  isNotDraggingAnyDay,
  isDraggingThisDay,
  changeServicePosition,
  draggingState,
  startDragging,
  changeDragging,
  endDragging,
  connectDropServiceTarget,
  connectDropDayTarget,
  connectDragDayPreview,
  connectDragDaySource,
  selectOption,
  selectTransport,
  fromService,
  toService,
  isLastDay,
}) => {
  const onAddService = useCallback(
    type => {
      goToAddService(day, type);
    },
    [day],
  );

  const { tripData, changeInitialLocation, changeFinalLocation } = useContext(TripContext);

  return (
    <>
      <div>
        <div>
          {isDraggingThisDay ? (
            <DraggingBox>
              <H2>Day {day}</H2>
            </DraggingBox>
          ) : (
            <DraggableDay>
              <TitleWrapper>
                <DayTitle day={day} tripStartDate={tripStartDate} />
                <DeleteDay onClick={() => removeDay(day)}>
                  <TrashCan />
                </DeleteDay>
              </TitleWrapper>
            </DraggableDay>
          )}
        </div>
        {connectDropServiceTarget(
          <div>
            <ServicesWrapper hidden={!isNotDraggingAnyDay}>
              <Services>
                {day === 1 && (
                  <Location>
                    <img alt="Start location" src={locationIcon} />
                    <LocationEdit
                      onChange={changeInitialLocation}
                      location={tripData.userStartLocation}
                    />
                  </Location>
                )}
                {services.map((data, index) => (
                  <React.Fragment key={data._id}>
                    <Transportation
                      selectTransport={selectTransport}
                      serviceId={data._id}
                      toService={toService}
                      fromService={fromService}
                      isFirst={index === 0 && day === 1}
                    >
                      <Service
                        startDraggingService={startDragging}
                        changeDraggingService={changeDragging}
                        endDraggingService={endDragging}
                        draggingState={draggingState}
                        changeServicePosition={changeServicePosition}
                        data={data}
                        index={index}
                        selectOption={selectOption}
                      />
                    </Transportation>
                    {isLastDay &&
                      index + 1 === services.length && (
                        <Transportation
                          key={data._id}
                          selectTransport={selectTransport}
                          serviceId={data._id}
                          toService={toService}
                          fromService={fromService}
                          overrideData={fromService[data._id]}
                          isFirst={index === 0 && day === 1}
                          isLast={index + 1 === services.length && isLastDay}
                        />
                      )}
                  </React.Fragment>
                ))}
                {isLastDay && (
                  <Location>
                    <img alt="End location" src={locationFinishIcon} />
                    <LocationEdit
                      onChange={changeFinalLocation}
                      location={tripData.userEndLocation}
                      isFinal
                    />
                  </Location>
                )}
                <AddServiceBox day={day} goToAddService={onAddService} />
              </Services>
            </ServicesWrapper>
          </div>,
        )}
      </div>
    </>
  );
};

Day.propTypes = {
  services: PropTypes.array.isRequired,
  tripStartDate: PropTypes.string.isRequired,
  day: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  removeDay: PropTypes.func.isRequired,
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
