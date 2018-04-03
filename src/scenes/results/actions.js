import Parse from "parse";

export const results_fetched = results => {
  return {
    type: "RESULTS_FETCHED",
    payload: results
  };
};

export const fetch_results = type => {
  return dispatch => {
    let query = undefined;
    if (type === "trip") {
      let Trip = Parse.Object.extend("Trip");
      query = new Parse.Query(Trip);
      query.descending("createdAt");
      query.limit(10);
    } else {
      let Service = Parse.Object.extend("Service");
      query = new Parse.Query(Service);
      query.equalTo("type", type);
      query.descending("createdAt");
      query.limit(8);
    }
    query.find().then(
      response => {
        const convertedResponse = normalizeParseResponseData(response);
        const responseWithPlaceholderImage = mapServiceObjects(
          convertedResponse
        );
        dispatch(results_fetched({ results: responseWithPlaceholderImage }));
      },
      error => {
        // TODO dispatch the error to error handler and retry the request
        console.log(error);
      }
    );
  };
};

/* Helpers Functions */

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
    service.title = service.name;
    service.location = `${service.city} ${service.country}`;
    service.rating = getRandomInt(1, 5);
    service.reviews = getRandomInt(1, 100);
    service.price = service.pricePerSession;
    service.image = get_service_image(service.mainPicture);
    return service;
  });
};
