import Parse from "parse";

export const places_fetched = places => {
  return {
    type: "PLACES_FETCHED",
    payload: places
  };
};

const normalizeParseResponseData = data => {
  let dataInJsonString = JSON.stringify(data);
  return JSON.parse(dataInJsonString);
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const fetch_places = () => {
  return dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.equalTo("type", "place");
    query.descending("createdAt");
    query.limit(6);
    query.find().then(
      response => {
        const convertedResponse = normalizeParseResponseData(response);
        const responseWithPlaceholderImage = convertedResponse.map(service => {
          service.excerpt = service.description;
          service.title = service.name;
          service.location = service.city + ", " + service.country;
          service.rating = getRandomInt(1, 5);
          service.reviews = getRandomInt(1, 100);
          //service.image = ...
          service.price = service.pricePerSession;

          return service;
        });
        dispatch(places_fetched({ places: responseWithPlaceholderImage }));
      },
      error => {
        // TODO dispatch the error to error handler and retry the request
        console.log(error);
      }
    );
  };
};
