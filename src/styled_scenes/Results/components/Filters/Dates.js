import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DayPickerRangeController } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';
import { primary, textDark, backgroundDark } from 'libs/colors';
import { P } from 'libs/commonStyles';
import Dropdown from 'shared_components/Dropdown';

const now = moment().startOf('day');
const isDayBlocked = date => date.valueOf() <= now.valueOf();

const ContentWrapper = styled.div`
  padding: 10px;
`;

const DontKnow = styled(P)`
  color: ${primary};
  border-bottom: 1px solid ${backgroundDark};
  padding: 0 25px 10px;
  cursor: pointer;
`;

const DarkSpan = styled.span`
  color: ${textDark};
  margin: 0 0.35em;
`;

const Trigger = styled(P)`
  color: ${primary};
`;

const DropdownContent = ({ startDate, endDate, onDateSelect, closeDropdown, isSingle }) => {
  const [focusedInput, setFocusedInput] = useState(START_DATE);
  const [selectedStartDate, setSelectedStartDate] = useState(startDate ? moment(startDate) : null);
  const [selectedEndDate, setSelectedEndDate] = useState(
    endDate && !isSingle ? moment(endDate) : null,
  );

  const onDatesChange = ({ startDate, endDate }) => {
    if (focusedInput === START_DATE) {
      setSelectedStartDate(startDate);
      setSelectedEndDate(null);
      if (isSingle) {
        onDateSelect({
          startDate: startDate.valueOf(),
          endDate: startDate
            .clone()
            .add(1, 'days')
            .valueOf(),
        });
        closeDropdown();
        return;
      }
      setFocusedInput(END_DATE);
      return;
    }
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    setFocusedInput(endDate ? START_DATE : END_DATE);

    if (startDate && endDate) {
      setSelectedEndDate(endDate);
      onDateSelect({
        startDate: startDate.valueOf(),
        endDate: endDate.valueOf(),
      });
      closeDropdown();
    }
  };

  const resetDates = () => {
    onDateSelect({ startDate: null, endDate: null });
    closeDropdown();
  };

  return (
    <ContentWrapper>
      <DontKnow onClick={resetDates}>I don't know my dates yet</DontKnow>
      <DayPickerRangeController
        initialVisibleMonth={() => selectedStartDate || moment()}
        onDatesChange={onDatesChange}
        isDayBlocked={isDayBlocked}
        focusedInput={focusedInput}
        startDate={selectedStartDate}
        endDate={selectedEndDate}
        daySize={35}
        hideKeyboardShortcutsPanel
        noBorder
      />
    </ContentWrapper>
  );
};

const Dates = ({ startDate, endDate, onDateSelect, isSingle }) => {
  const renderTrigger = () => {
    if (isSingle) {
      if (startDate) {
        return <Trigger>{moment(startDate).format('MMM DD')}</Trigger>;
      }
      return <Trigger>Select date</Trigger>;
    }
    if (startDate && endDate) {
      return (
        <Trigger>
          {moment(startDate).format('MMM DD')}
          <DarkSpan>to</DarkSpan>
          {moment(endDate).format('MMM DD')}
        </Trigger>
      );
    }
    return <Trigger>Select dates</Trigger>;
  };
  return (
    <Dropdown trigger={renderTrigger()}>
      <DropdownContent
        isSingle={isSingle}
        startDate={startDate}
        endDate={endDate}
        onDateSelect={onDateSelect}
      />
    </Dropdown>
  );
};

Dates.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
  startDate: PropTypes.number,
  endDate: PropTypes.number,
  isSingle: PropTypes.bool,
};

Dates.defaultProps = {
  startDate: null,
  endDate: null,
  isSingle: false,
};

export default Dates;
