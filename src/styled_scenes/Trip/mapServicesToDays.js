import React, { Component } from 'react';
import moment from 'moment';

// i18n
import { Trans } from '@lingui/macro';

export function minutesToDays(duration) {
  return Math.ceil(duration / (60 * 24)); // Duration is in minutes
}

export function getDaysByService(services) {
  return services.reduce((prev, service) => {
    if (!service.service) {
      return prev;
    }

    const id = service.service._id;
    if (!prev[id]) {
      return {
        ...prev,
        [id]: [service.day],
      };
    }

    return {
      ...prev,
      [id]: [...prev[id], service.day],
    };
  }, {});
}

export function getDayDate(dayNumber, date, short) {
  const dayDate = moment(date).add(dayNumber - 1, 'days');
  return short ? dayDate.format('MMM DD') : dayDate.format('dddd, MMMM DD');
}

export function dayTitles(dayNumber, date) {
  return {
    title: date ? getDayDate(dayNumber, date, false) : <Trans>Day {dayNumber}</Trans>,
    shortTitle: date ? getDayDate(dayNumber, date, true) : <Trans>Day {dayNumber}</Trans>,
  };
}

export function updateServiceDayNames(days, date) {
  return days.map(day => ({
    ...day,
    ...dayTitles(day.day, date),
  }));
}

export function mapServicesByDay(services) {
  return services.reduce((prevObj, service) => {
    const prevValue = prevObj[service.day];

    return {
      ...prevObj,
      [service.day]: [...(prevValue || []), service],
    };
  }, {});
}

export function mapDaysToServices(days) {
  return Object.keys(days).reduce((prev, day) => {
    return [...prev, ...days[day]];
  }, []);
}

export default function mapServicesToDays(services, duration, date) {
  const numberOfDays = minutesToDays(duration);
  const daysArray = Array.from({ length: numberOfDays });
  const servicesByDay = services.reduce((prevObj, service) => {
    const prevValue = prevObj[service.day];

    return {
      ...prevObj,
      [service.day]: [...(prevValue || []), service],
    };
  }, {});

  return daysArray.map((_, i) => ({
    ...dayTitles(i + 1, date),
    day: i + 1,
    data: servicesByDay[i + 1] || [],
  }));
}
