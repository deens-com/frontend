import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Service from './Service';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { dayDroppablePrefix, types } from '../constants';
import { getDayDate } from 'styled_scenes/Trip/mapServicesToDays';
import { primary, secondary } from 'libs/colors';
import { H3, P } from 'libs/commonStyles';
import { Drag } from 'shared_components/icons';
import AddButton from '../AddButton';

const DraggableDay = styled.div``;

const ServicesWrapper = styled.div`
  display: ${props => (props.hidden ? 'none' : 'flex')};
  min-height: 225px;
  margin: 10px 0;
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
  margin-bottom: 54px;
  > div {
    margin: 0 15px;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
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

const Day = ({ services, day, id, tripStartDate, summaryView, addNewDay }) => {
  //index={day-1} at Draggable because destination is not modified by this prop and it gets array index
  return (
    <>
      <Draggable draggableId={`day-${id}`} index={day - 1} type={types.DAY}>
        {provided => (
          <DraggableDay {...provided.draggableProps} ref={provided.innerRef}>
            <TitleWrapper>
              <span {...provided.dragHandleProps}>
                <Drag />
              </span>
              <H3>Day {day}</H3>
              <Divider>•</Divider>
              <P>{getDayDate(day, tripStartDate)}</P>
            </TitleWrapper>
          </DraggableDay>
        )}
      </Draggable>
      <ServicesWrapper hidden={summaryView}>
        <Droppable
          droppableId={`${dayDroppablePrefix}${day}`}
          direction="horizontal"
          type={types.SERVICE}
        >
          {(provided, snapshot) => (
            <Services {...provided.droppableProps} ref={provided.innerRef}>
              {services.map((data, index) => (
                <Service key={data._id} data={data} index={index} />
              ))}
              {provided.placeholder}
              <AddServiceBox>
                <AddButton />
              </AddServiceBox>
            </Services>
          )}
        </Droppable>
      </ServicesWrapper>
      <AddDayBox onClick={addNewDay.bind(this, day)} hidden={summaryView}>
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
  summaryView: PropTypes.bool,
};

Day.defaultProps = {
  summaryView: false,
};

export default Day;
