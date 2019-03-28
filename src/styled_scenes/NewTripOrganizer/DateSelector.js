import 'react-dates.css'
import React, { useContext, useState, useEffect } from 'react';
import { PlusIcon, MinusIcon } from 'shared_components/icons';
import styled from 'styled-components'
import moment from 'moment'
import { DayPickerRangeController } from 'react-dates'
import { START_DATE, END_DATE } from 'react-dates/constants'
import { minutesToDays } from 'libs/Utils'
import { TripContext } from './'
import { primary } from 'libs/colors'
import { P, H2Subtitle } from 'libs/commonStyles'

const now = moment().add(1, 'days');
const isDayBlocked = date => date.valueOf() <= now.valueOf();

const Wrapper = styled.div`
`

const SelectDays = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const NumberOfDays = styled(P)`
  margin-right: 17px;
`

const IconButton = styled.button`
  border: 1px solid ${primary};
  color: ${primary};
  border-radius: 5px 5px 5px 0;
  ${props => props.left ? 'margin-right: 13px;' : 'margin-left: 13px;'}
  width: 32px;
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

const DateSelector = () => {
  const focusedInput = START_DATE
  const { tripData, changeTripDuration, changeStartDate } = useContext(TripContext);
  const numberOfDays = minutesToDays(tripData.duration)
  const [startDate, setStartDate] = useState(moment(tripData.startDate))

  const removeDay = () => {
    changeTripDuration(numberOfDays - 1)
  }

  const addDay = () => {
    changeTripDuration(numberOfDays + 1)
  }
  

  const onDatesChange = ({ startDate }) => {
    setStartDate(startDate)
    changeStartDate(startDate)
  }

  const onFocusChange = () => {}

  return (
    <Wrapper>
      <SelectDays>
        <NumberOfDays>Number of days: </NumberOfDays>
        <IconButton left onClick={removeDay}><MinusIcon style={{ width: 24, height: 24 }} /></IconButton>
        <H2Subtitle>{numberOfDays}</H2Subtitle>
        <IconButton onClick={addDay}><PlusIcon /></IconButton>
      </SelectDays>
      <DayPickerRangeController
        initialVisibleMonth={() => startDate}
        onDatesChange={onDatesChange}
        onFocusChange={onFocusChange}
        focusedInput={focusedInput}
        startDate={startDate}
        endDate={startDate.clone().add(numberOfDays, 'days')}
        isDayBlocked={isDayBlocked}
        daySize={35}
        noBorder
      />
    </Wrapper>
  )
}

DateSelector.propTypes = {
}

export default DateSelector
