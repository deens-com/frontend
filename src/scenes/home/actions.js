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
    payload: {
      trips: trips
    }
  };
};

export const retrieve_exciting_activities = activities => {
  return {
    type: "EXCITING_ACTIVITIES_RETRIEVED",
    payload: {
      exciting_activities: activities
    }
  };
};

export const retrieve_popular_places = places => {
  return {
    type: "POPULAR_PLACES_RETRIEVED",
    payload: {
      popularPlaces: places
    }
  };
};

export const retrieve_delicious_food = foods => {
  return {
    type: "DELICIOUS_FOOD_RETRIEVED",
    payload: {
      delicious_foods: foods
    }
  };
};

export const retrieve_popular_tags = services => {
  return {
    type: "POPULAR_TAGS_RETRIEVED",
    payload: find_popular_tags(services)
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

/**
 * The maximum is inclusive and the minimum is inclusive
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sortServicesByCreationDateDesc = (service1, service2) => {
  const date1Object = new Date(service1.createdAt);
  const date2Object = new Date(service2.createdAt);
  if (date1Object > date2Object) return -1;
  if (date1Object < date2Object) return 1;
  return 0;
};

/* Actions */

export const fetch_services = () => {
  return dispatch => {
    let services_promise = Parse.Cloud.run("fetch_homepage_services");
    services_promise.then(
      response => {
        let convertedResponse = normalizeParseResponseData(response);
        convertedResponse.activities = mapServiceObjects(
          convertedResponse.activities
        );
        convertedResponse.places = mapServiceObjects(convertedResponse.places);
        convertedResponse.foods = mapServiceObjects(convertedResponse.foods);

        dispatch(services_fetched({ services: convertedResponse }));
        dispatch(retrieve_popular_tags({ services: convertedResponse }));
        dispatch(retrieve_popular_places(convertedResponse.places));
        dispatch(retrieve_exciting_activities(convertedResponse.activities));
        dispatch(retrieve_delicious_food(convertedResponse.foods));
      },
      error => {
        console.log(error);
      }
    );
  };
};

export const fetch_trips = () => {
  return dispatch => {
    let Trip = Parse.Object.extend("Trip");
    let query = new Parse.Query(Trip);
    query.descending("createdAt");
    query.equalTo("status", "public");
    query.limit(8);
    query.find().then(
      response => {
        const convertedResponse = normalizeParseResponseData(response);
        const responseWithPlaceholderImage = convertedResponse.map(trip => {
          trip.excerpt = trip.description;
          // TODO replace dummy rate, reviews, and image once it's ready
          trip.rating = trip.rating;
          trip.reviews = getRandomInt(1, 100);
          trip.image = trip.picture.url;
          trip.price = getRandomInt(500, 10000);
          return trip;
        });
        dispatch(trips_fetched(responseWithPlaceholderImage));
      },
      error => {
        // TODO dispatch the error to error handler and retry the request
        console.log(error);
      }
    );
  };
};

/* Helpers Functions */

const find_popular_tags = services => {
  let arr_services = services.services.places
    .concat(services.services.foods)
    .concat(services.services.activities);
  let services_with_tags = arr_services.filter(
    service => service.tags && service.tags.length
  );
  let tags = [];
  services_with_tags.forEach(service => {
    tags.push(service.tags);
  });
  if (!services_with_tags.length) {
    return [];
  }
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
  return tags_ordered_by_popularity.slice(0, 8);
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
