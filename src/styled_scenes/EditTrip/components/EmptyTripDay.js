import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const EmptyDropHere = styled.div`
  background-color: #efeff1;
  height: 112px;
  width: 100%;
  border-radius: 4px;
  text-align: center;
`;

const RestDay = styled(EmptyDropHere)`
  height: 56px;
`;

const EmptyDropText = styled.h3`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

const RestDayText = styled(EmptyDropText)`
  font-style: italic;
`;

const EmptyTripDay = ({ allowServiceRearrange }) => {
  if (allowServiceRearrange) {
    return (
      <EmptyDropHere>
        <EmptyDropText>Drop services here</EmptyDropText>
      </EmptyDropHere>
    );
  }
  return (
    <RestDay>
      <RestDayText>
        It's a rest day! It is good to take some time for yourself to wander around with nothing planned
      </RestDayText>
    </RestDay>
  );
};

EmptyTripDay.propTypes = {
  allowServiceRearrange: PropTypes.bool,
};

export default EmptyTripDay;
