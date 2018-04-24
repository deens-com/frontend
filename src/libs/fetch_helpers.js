import Parse from "parse";

const normalizeParseResponseData = data => {
  let dataInJsonString = JSON.stringify(data);
  return JSON.parse(dataInJsonString);
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const get_service_image = mainPicture => {
  if (!mainPicture) {
    return "https://dummyimage.com/600x400/000/fff";
  }
  return mainPicture.url;
};

const mapServiceObjects = services => {
  return services.map(service => {
    service.excerpt = service.description;
    service.title = service.name || service.title;
    service.latitude = service.location && service.location.latitude || 1;
    service.longitude = service.location && service.location.longitude || 1;
    service.location = `${service.city} ${service.country}`;
    service.rating = getRandomInt(1, 5);
    service.reviews = getRandomInt(1, 100);
    service.price = service.pricePerSession || getRandomInt(200, 800);
    if (service.type === undefined) {
      service.image = service.picture.url;
    } else {
      service.image = get_service_image(service.mainPicture);
    }
    return service;
  });
};

const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

const build_query = (model) => {
  let Model = Parse.Object.extend(model);
  let query = new Parse.Query(Model);
  return query;
};

export default {normalizeParseResponseData, getRandomInt, get_service_image, mapServiceObjects, removeDuplicates, build_query}
