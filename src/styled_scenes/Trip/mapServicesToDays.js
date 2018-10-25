import moment from 'moment';

export function minutesToDays(duration) {
  return Math.ceil(duration / (60 * 24)); // Duration is in minutes
}

export function dayTitles(dayNumber, date) {
  return {
    title: date
      ? moment(date)
          .add(dayNumber - 1, 'days')
          .format('MMM DD, dddd')
      : `Day ${dayNumber}`,
    shortTitle: date
      ? moment(date)
          .add(dayNumber - 1, 'days')
          .format('MMM DD')
      : `Day ${dayNumber}`,
  };
}

export function updateServiceDayNames(days, date) {
  return days.map(day => ({
    ...day,
    ...dayTitles(day.day, date),
  }));
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
