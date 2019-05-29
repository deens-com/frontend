import 'react-dates.css';
import React, { useContext, useState } from 'react';
import PlusIcon from 'shared_components/icons/PlusIcon';
import MinusIcon from 'shared_components/icons/MinusIcon';
import styled from 'styled-components';
import moment from 'moment';
import { minutesToDays } from 'libs/Utils';
import { TripContext } from './';
import { primary } from 'libs/colors';
import { P, H2Subtitle } from 'libs/commonStyles';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerRangeController } from 'react-dates';
import { START_DATE } from 'react-dates/constants';

const now = moment().add(1, 'days');
const isDayBlocked = date => date.valueOf() <= now.valueOf();

const Wrapper = styled.div`
  .CalendarDay__selected_end {
    background: #66e2da;
    border: 1px double #33dacd;
  }
`;

const SelectDays = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NumberOfDays = styled(P)`
  margin-right: 17px;
`;

const IconButton = styled.button`
  border: 1px solid ${primary};
  color: ${primary};
  border-radius: 5px 5px 5px 0;
  ${props => (props.left ? 'margin-right: 13px;' : 'margin-left: 13px;')} width: 32px;
  height: 32px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  :hover:enabled {
    background-color: ${primary};
    color: white;
    cursor: pointer;
  }
  :disabled {
    opacity: 0.5;
  }
`;

const DateSelector = ({ close }) => {
  const focusedInput = START_DATE;
  const { tripData, changeTripDuration, changeStartDate } = useContext(TripContext);
  const numberOfDays = minutesToDays(tripData.duration);
  const [startDate, setStartDate] = useState(moment(tripData.startDate));

  const removeDay = () => {
    if (numberOfDays < 2) {
      return;
    }
    changeTripDuration(numberOfDays - 1);
  };

  const addDay = () => {
    changeTripDuration(numberOfDays + 1);
  };

  const onDatesChange = ({ startDate }) => {
    close();
    setStartDate(startDate);
    changeStartDate(startDate);
  };

  const onFocusChange = () => {};

  return (
    <Wrapper>
      <SelectDays>
        <NumberOfDays>Number of days: </NumberOfDays>
        <IconButton disabled={numberOfDays < 2} left onClick={removeDay}>
          <MinusIcon style={{ width: 24, height: 24 }} />
        </IconButton>
        <H2Subtitle>{numberOfDays}</H2Subtitle>
        <IconButton onClick={addDay}>
          <PlusIcon />
        </IconButton>
      </SelectDays>
      <DayPickerRangeController
        initialVisibleMonth={() => startDate}
        onDatesChange={onDatesChange}
        onFocusChange={onFocusChange}
        focusedInput={focusedInput}
        startDate={startDate}
        endDate={startDate.clone().add(numberOfDays - 1, 'days')}
        isDayBlocked={isDayBlocked}
        daySize={35}
        hideKeyboardShortcutsPanel
        noBorder
      />
    </Wrapper>
  );
};

DateSelector.propTypes = {};

export default DateSelector;
