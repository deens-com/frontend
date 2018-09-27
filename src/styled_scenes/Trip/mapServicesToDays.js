export default function mapServicesToDays(services) {
  const servicesByDay = services.reduce((prevObj, service) => {
    const prevValue = prevObj[service.day];

    return {
      ...prevObj,
      [service.day]: [...(prevValue || []), service],
    };
  }, {});

  return Object.keys(servicesByDay)
    .sort()
    .map(key => ({
      title: `Day ${key}`,
      data: servicesByDay[key],
    }));
}
