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

const bgColors = ["#7bbed6", "#82689a", "#75c1a5", "#ed837f", "#ffb777"];
const hoverBgColors = ["#84c5dd", "#9379ab", "#76caac", "#eb8e8a", "#ffc089"];

const mapServiceObjects = services => {
  return services.map(service => {
    try{
      service.excerpt = service.description;
      service.title = service.name || service.title;
      // eslint-disable-next-line
      service.latitude = service.location && service.location.latitude || 1;
      // eslint-disable-next-line
      service.longitude = service.location && service.location.longitude || 1;
      service.location = `${service.city} ${service.country}`;
      service.rating = service.rating;
      service.reviewCount = service.reviewCount;
      service.price = service.pricePerSession || getRandomInt(200, 800);
      if(service.tags && service.tags.length){
        const tags = service.tags.map(tag => {
          const randBg = bgColors[Math.floor(Math.random() * bgColors.length)];
          const randHoverBg = hoverBgColors[Math.floor(Math.random() * hoverBgColors.length)];
          return {label: tag, hoverBg: randHoverBg, background: randBg}
        });
        service.tags = tags;
      }
      if (service.type === undefined || service.type === 'trip') {
        service.latitude = service.latitude;
        service.longitude = service.longitude;
        service.image = service.picture.url;
      } else {
        service.image = get_service_image(service.mainPicture);
      }
    }catch(error){
      console.log(error);
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

export default {
  normalizeParseResponseData,
  getRandomInt,
  get_service_image,
  mapServiceObjects,
  removeDuplicates,
  build_query,
  bgColors,
  hoverBgColors
}
