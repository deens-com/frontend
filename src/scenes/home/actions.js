import Parse from "parse";

export const services_fetched = services => {
  return {
    type: "SERVICES_FETCHED",
    payload: services
  };
};

export const trips_fetched = trips => {
  return {
    type: "TRIPS_FETCHED",
    payload: trips
  };
};

const bgColors = ["#7bbed6", "#82689a", "#75c1a5", "#ed837f", "#ffb777"];
const hoverBgColors = ["#84c5dd", "#9379ab", "#76caac", "#eb8e8a", "#ffc089"];

/**
 * Convert the collection to a literal object.
 * @param {Array} data A collection of ParseObjectSubclass item
 */
const normalizeParseResponseData = data => {
  let dataInJsonString = JSON.stringify(data);
  return JSON.parse(dataInJsonString);
};

export const retrieve_popular_tags = services => {
  let services_with_tags = services.services.filter(
    service => service.tags && service.tags.length
  );
  let tags = [];
  services_with_tags.forEach(service => {
    tags.push(service.tags);
  });
  let flatten_tags = tags.reduce((flatten, arr) => [...flatten, ...arr]);
  let tag_recurrence_count_hash = new Map(
    [...new Set(flatten_tags)].map(x => [
      x,
      flatten_tags.filter(y => y === x).length
    ])
  );
  let tags_array = [];
  tag_recurrence_count_hash.forEach((k, v) =>
    tags_array.push({ tag: v, count: k })
  );
  let tags_ordered_by_count = tags_array.sort((a, b) => b.count - a.count);
  let tags_ordered_by_popularity = tags_ordered_by_count.map(tag => {
    let randBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    let randHoverBg =
      hoverBgColors[Math.floor(Math.random() * hoverBgColors.length)];
    return { label: tag.tag, background: randBg, hoverBg: randHoverBg };
  });
  // Ugly code to retrive popular tags but we might refactor tags data model in near future
  return {
    type: "POPULAR_TAGS_RETRIEVED",
    payload: tags_ordered_by_popularity
  };
};

export const fetch_services = () => {
  return dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.descending("createdAt");
    query
      .find()
      .then(response => {
        const convertedResponse = normalizeParseResponseData(response);
        dispatch(services_fetched({ services: convertedResponse }));
        dispatch(retrieve_popular_tags({ services: convertedResponse }));
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const fetch_trips = () => {
  return dispatch => {
    let Trip = Parse.Object.extend("Trip");
    let query = new Parse.Query(Trip);
    query.descending("createdAt");
    query.equalTo("status", "public");
    query.limit(4);
    query
      .find()
      .then(response => {
        const convertedResponse = normalizeParseResponseData(response);
        const responseWithPlaceholderImage = convertedResponse.map(trip => {
          trip.image = "https://placeimg.com/640/480/nature";
          return trip;
        });
        dispatch(trips_fetched({ trips: responseWithPlaceholderImage }));
      })
      .catch(error => {
        // TODO dispatch the error to error handler
        console.log(error);
      });
  };
};
