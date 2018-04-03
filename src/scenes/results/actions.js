import Parse from "parse";

export const places_fetched = places => {
  return {
    type: "PLACES_FETCHED",
    payload: places
  };
};

export const activities_fetched = activities => {
  return {
    type: "ACTIVITIES_FETCHED",
    payload: activities
  };
};

export const foods_fetched = foods => {
  return {
    type: "FOODS_FETCHED",
    payload: foods
  };
};

export const trips_fetched = trips => {
  return {
    type: "TRIPS_FETCHED",
    payload: trips
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

export const fetch_activities = () => {
  return dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.equalTo("type", "activity");
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
        dispatch(
          activities_fetched({ activities: responseWithPlaceholderImage })
        );
      },
      error => {
        // TODO dispatch the error to error handler and retry the request
        console.log(error);
      }
    );
  };
};

export const fetch_foods = () => {
  return dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.equalTo("type", "food");
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
        dispatch(foods_fetched({ foods: responseWithPlaceholderImage }));
      },
      error => {
        // TODO dispatch the error to error handler and retry the request
        console.log(error);
      }
    );
  };
};

export const fetch_trips = () => {
  return dispatch => {
    let Trip = Parse.Object.extend("Trip");
    let query = new Parse.Query(Trip);
    query.equalTo("type", "activity");
    query.descending("createdAt");
    query.limit(10);
    query.find().then(
      response => {
        const trips = normalizeParseResponseData(response);
        dispatch(trips_fetched({ trips: trips }));
      },
      error => {
        // TODO dispatch the error to error handler
        console.log(error);
      }
    );
  };
};
