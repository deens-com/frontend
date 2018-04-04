import Parse from "parse";

export const results_fetched = results => {
  return {
    type: "RESULTS_FETCHED",
    payload: results
  };
};

export const search_query_updated = search_query => {
  return {
    type: "SEARCH_QUERY_UPDATED",
    payload: search_query
  };
};

export const update_search_query = search_params => {
  return dispatch => {
    dispatch(search_query_updated({ search_query: search_params }));
    dispatch(fetch_results(search_params));
  };
};

const service_types = ["activity", "food", "place"];

export const fetch_results = search_query => {
  return dispatch => {
    let query = undefined;

    let tags = search_query.tags;
    let type = search_query.type;

    if (type === "trip") {
      let Trip = Parse.Object.extend("Trip");
      query = new Parse.Query(Trip);
      query.descending("createdAt");
      query.limit(10);
      query = query.find();
    } else if (service_types.includes(type)) {
      let Service = Parse.Object.extend("Service");
      query = new Parse.Query(Service);
      query.equalTo("type", type);
      query.descending("createdAt");
      query.limit(8);
      query = query.find();
    } else if (tags.length) {
      query = Parse.Cloud.run("fetch_services_from_tags", { tags: tags });
    }

    query.then(
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
    service.price = service.pricePerSession || getRandomInt(200, 800);
    if (service.type === undefined) {
      service.image = service.picture.url;
    } else {
      service.image = get_service_image(service.mainPicture);
    }
    return service;
  });
};
