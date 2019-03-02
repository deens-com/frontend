import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragSource, DropTarget } from 'react-dnd';
import Service from './Service';
import { types } from '../constants';
import { getDayDate } from 'styled_scenes/Trip/mapServicesToDays';
import { primary, secondary, primaryContrast, error } from 'libs/colors';
import { H3, P } from 'libs/commonStyles';
import { Drag, TrashCan } from 'shared_components/icons';
import AddButton from '../AddButton';

const DraggableDay = styled.div`
  background-color: white;
  display: inline-block;
`;

const ServicesWrapper = styled.div`
  display: ${props => (props.hidden ? 'none' : 'flex')};
  min-height: 225px;
  margin: 10px 0 64px;
`;

const DraggingBox = styled.div`
  background-color: ${primary};
  border: 1px solid ${primaryContrast};
  border-radius: 10px 10px 10px 0;
  width: 100%;
  max-width: 400px;
  > h3 {
    opacity: 0.7;
    margin-left: 30px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  > h3 {
    margin-left: 15px;
  }
`;
const Divider = styled.span`
  color: ${secondary};
  margin: 0 5px;
`;

const Services = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  > div > div {
    margin-left: 15px;
    margin-right: 15px;
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
`;

const AddServiceBox = styled.div`
  border-radius: 10px 10px 10px 0;
  width: 190px;
  height: 225px;
  position: relative;
  overflow: hidden;
  border: 1px dashed ${primary};
  align-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${secondary};
    border: 1px solid ${secondary};
  }
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

const AddDayBox = styled.div`
  margin: auto;
  border-radius: 10px 10px 10px 0;
  width: 100%;
  max-width: 1110px;
  position: relative;
  overflow: hidden;
  border: 1px dashed ${primary};
  align-self: flex-end;
  display: ${props => (props.hidden ? 'none' : 'flex')};
  padding: 11px 0;
  justify-content: center;
  align-items: center;
  margin-bottom: 72px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  &:hover {
    background-color: ${secondary};
    border: 1px solid ${secondary};
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
  addNewDay,
  changeServicePosition,
  draggingState,
  startDragging,
  changeDragging,
  endDragging,
  connectDropServiceTarget,
  connectDropDayTarget,
  connectDragDayPreview,
  connectDragDaySource,
}) => {
  const addDay = useCallback(() => {
    addNewDay(day);
  });

  return (
    <>
      {connectDropDayTarget(
        <div>
          {connectDragDayPreview(
            <div>
              {isDraggingThisDay ? (
                <DraggingBox>
                  <H3>Day {day}</H3>
                </DraggingBox>
              ) : (
                <DraggableDay>
                  <TitleWrapper>
                    {connectDragDaySource(
                      <div>
                        <Drag />
                      </div>,
                    )}
                    <H3>Day {day}</H3>
                    <Divider>•</Divider>
                    <P>{getDayDate(day, tripStartDate)}</P>
                    <DeleteDay onClick={() => removeDay(day)}>
                      <TrashCan />
                    </DeleteDay>
                  </TitleWrapper>
                </DraggableDay>
              )}
            </div>,
            {
              offsetX: 0,
              offsetY: 0,
            },
          )}
          {connectDropServiceTarget(
            <div>
              <ServicesWrapper hidden={!isNotDraggingAnyDay}>
                <Services>
                  {services.map((data, index) => (
                    <Service
                      startDraggingService={startDragging}
                      changeDraggingService={changeDragging}
                      endDraggingService={endDragging}
                      draggingState={draggingState}
                      changeServicePosition={changeServicePosition}
                      key={data._id}
                      data={data}
                      index={index}
                    />
                  ))}
                  <AddServiceBox onClick={() => goToAddService(day)}>
                    <AddButton />
                  </AddServiceBox>
                </Services>
              </ServicesWrapper>
            </div>,
          )}
        </div>,
      )}
      <AddDayBox onClick={addDay} hidden={!isNotDraggingAnyDay}>
        <AddButton />
      </AddDayBox>
    </>
  );
};

Day.propTypes = {
  services: PropTypes.array.isRequired,
  tripStartDate: PropTypes.string.isRequired,
  day: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  addNewDay: PropTypes.func.isRequired,
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
