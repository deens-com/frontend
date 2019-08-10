import React from 'react';
import styled from 'styled-components';
import AddServiceBox from './AddServiceBox';
import DayTitle from 'shared_components/DayTitle';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 25px;
  width: 100%;
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: white;
  opacity: 0.75;
  z-index: 1;
  cursor: pointer;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const EmptyDay = ({ addNewDay, day, tripStartDate }) => {
  const add = () => addNewDay();
  return (
    <div>
      <Wrapper>
        <Overlay onClick={add} />
        <TitleWrapper>
          <DayTitle day={day} tripStartDate={tripStartDate} />
        </TitleWrapper>
        <AddServiceBox lowMargin />
      </Wrapper>
    </div>
  );
};

export default EmptyDay;
