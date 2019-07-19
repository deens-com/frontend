import 'react-dates.css';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { minutesToDays } from 'libs/Utils';
import { TripContext } from '../../';
import { PSmall } from 'libs/commonStyles';
import { tertiary } from 'libs/colors';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerRangeController } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';

const Text = styled(PSmall)`
  font-style: italic;
  color: ${tertiary};
  text-align: center;
`;

const ServiceSettings = ({ service, servicesByDay }) => {
  const [serviceStartDate, setServiceStartDate] = useState(null);
  const [serviceEndDate, setServiceEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(START_DATE);
  const { tripData, changeServiceDays } = useContext(TripContext);
  const numberOfDays = minutesToDays(tripData.duration);
  const tripStartDate = useMemo(() => moment(tripData.startDate), [tripData.startDate]);
  const tripEndDate = tripStartDate.clone().add(numberOfDays, 'days');

  useEffect(
    () => {
      // do this when we fetch the trip and have key/value being
      // key: service organization id
      // value: array of service organization ids within their group
      // probably could be done with web workers when this is merged
      // https://github.com/facebook/create-react-app/pull/5886
      let currentDay = -1;
      let setNumber = -1;
      let currentGroup; // the group our service belongs to
      const sets = []; // each set represent a group of subsequent instances of this service
      const currentId = service.service._id;
      servicesByDay.forEach(s => {
        if (s.service._id === currentId) {
          if (s.day === currentDay + 1) {
            currentDay = s.day;
            sets[setNumber] = [...sets[setNumber], s.day];
          } else {
            setNumber = setNumber + 1;
            sets[setNumber] = [s.day];
            currentDay = s.day;
          }
          if (s._id === service._id) {
            currentGroup = setNumber;
          }
        }
      });
      setServiceStartDate(tripStartDate.clone().add(sets[currentGroup][0] - 1, 'days'));
      setServiceEndDate(
        tripStartDate.clone().add(sets[currentGroup][sets[currentGroup].length - 1], 'days'),
      );
    },
    [servicesByDay, tripStartDate, service.service._id, service._id],
  );

  const onDatesChange = ({ startDate, endDate }) => {
    if (focusedInput === START_DATE) {
      setServiceStartDate(startDate);
      setServiceEndDate(null);
      setFocusedInput(END_DATE);
      return;
    }
    setServiceStartDate(startDate);
    setServiceEndDate(endDate);
    setFocusedInput(endDate ? START_DATE : END_DATE);

    if (startDate && endDate) {
      // we sum 1 to startDay so it's 1 instead of 0
      // not to end because it's supposed to be selected the checkout day, and we don't add the service to that day
      changeServiceDays(
        service,
        startDate.diff(tripStartDate, 'days') + 1,
        endDate.diff(tripStartDate, 'days'),
      );
    }
  };

  const onFocusChange = () => {};

  const isOutsideRange = day => {
    return day.isBefore(tripStartDate, 'day') || day.isAfter(tripEndDate, 'day');
  };

  return (
    <>
      <DayPickerRangeController
        initialVisibleMonth={() => serviceStartDate || tripStartDate}
        onDatesChange={onDatesChange}
        onFocusChange={onFocusChange}
        focusedInput={focusedInput}
        startDate={serviceStartDate}
        endDate={serviceEndDate}
        isOutsideRange={isOutsideRange}
        daySize={35}
        hideKeyboardShortcutsPanel
        noBorder
      />
      <Text>Select check-in and check-out</Text>
    </>
  );
};

ServiceSettings.propTypes = {
  removeService: PropTypes.func.isRequired,
  service: PropTypes.object.isRequired,
};

export default ServiceSettings;
