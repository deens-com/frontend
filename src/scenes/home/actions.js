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

export const retrieve_exciting_activities = activities => {
  return {
    type: "EXCITING_ACTIVITIES_RETRIEVED",
    payload: {
      exciting_activities: activities
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

export const retrievePopularPlaces = payload => {
  return {
    type: "POPULAR_PLACES_RETRIEVED",
    payload: {
      popularPlaces: find_popular_places(payload.services)
    }
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
  return async dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.descending("createdAt");
    query
      .find()
      .then(async response => {
        const convertedResponse = normalizeParseResponseData(response);
        dispatch(services_fetched({ services: convertedResponse }));
        dispatch(retrieve_popular_tags({ services: convertedResponse }));
        const exiciting_activities = await async_retrieve_exciting_activities({
          services: convertedResponse
        });
        dispatch(retrieve_exciting_activities(exiciting_activities));
        const delicious_foods = await async_retrieve_delicious_foods({
          services: convertedResponse
        });
        dispatch(retrieve_delicious_food(delicious_foods));
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
    query.find().then(
      response => {
        const convertedResponse = normalizeParseResponseData(response);
        const responseWithPlaceholderImage = convertedResponse.map(trip => {
          trip.excerpt = trip.description;
          // TODO replace dummy rate, reviews, and image once it's ready
          trip.rating = getRandomInt(1, 5);
          trip.reviews = getRandomInt(1, 100);
          trip.image = "https://placeimg.com/640/480/nature";
          trip.price = getRandomInt(500, 10000);
          return trip;
        });
        dispatch(trips_fetched({ trips: responseWithPlaceholderImage }));
      },
      error => {
        // TODO dispatch the error to error handler and retry the request
        console.log(error);
      }
    );
  };
};

/* Helpers Functions */

const find_popular_places = async services => {
  const filteredServices = services
    .filter(service => service.type === "place")
    .map(service => {
      service.excerpt = service.description;
      service.title = service.name;
      // TODO replace dummy rate, reviews, once it's ready
      service.rating = getRandomInt(1, 5);
      service.reviews = getRandomInt(1, 100);
      service.price = getRandomInt(500, 10000);
      return service;
    })
    .sort(sortServicesByCreationDateDesc)
    .splice(0, 4);

  let services_filtered = await Promise.all(
    filteredServices.map(async service => {
      let picture = await get_service_image(service);
      service.image = picture;
      return service;
    })
  );
  return services_filtered;
};

const find_popular_tags = services => {
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
  return tags_ordered_by_popularity;
};

const get_service_image = async service => {
  let ServicePicture = Parse.Object.extend("ServicePicture");
  let query = new Parse.Query(ServicePicture);
  query.equalTo("service", {
    __type: "Pointer",
    className: "Service",
    objectId: service.objectId
  });
  query.limit(1);
  let pictures = await query.find();
  return pictures[0].get("picture").url();
};

export const async_retrieve_exciting_activities = async payload => {
  const filteredServices = payload.services
    .filter(service => service.type === "activity")
    .map(service => {
      service.excerpt = service.description;
      service.title = service.name;
      service.location = service.city + ", " + service.country;
      service.rating = getRandomInt(1, 5);
      service.reviews = getRandomInt(1, 100);
      service.price = service.pricePerSession;
      return service;
    });
  let services_filtered = await Promise.all(
    filteredServices.map(async service => {
      let picture = await get_service_image(service);
      service.img = picture;
      return service;
    })
  );
  return services_filtered;
};

export const async_retrieve_delicious_foods = async payload => {
  const filteredServices = payload.services
    .filter(service => service.type === "food")
    .map(service => {
      service.excerpt = service.description;
      service.title = service.name;
      service.location = service.city + ", " + service.country;
      service.rating = getRandomInt(1, 5);
      service.reviews = getRandomInt(1, 100);
      service.price = service.pricePerSession;
      return service;
    });
  let services_filtered = await Promise.all(
    filteredServices.map(async service => {
      let picture = await get_service_image(service);
      service.image = picture;
      return service;
    })
  );
  return services_filtered;
};
