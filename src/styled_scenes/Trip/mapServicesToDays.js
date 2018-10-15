import moment from 'moment';

export function minutesToDays(duration) {
  return Math.ceil(duration / (60 * 24)); // Duration is in minutes
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
    title: date
      ? moment(date)
          .add(i, 'days')
          .format('MMM DD, dddd')
      : `Day ${i + 1}`,
    shortTitle: date
      ? moment(date)
          .add(i, 'days')
          .format('MMM DD')
      : `Day ${i + 1}`,
    day: i + 1,
    data: servicesByDay[i + 1] || [],
  }));
}
