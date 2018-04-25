import Parse from "parse";
import fetch_helpers from "./../../libs/fetch_helpers";

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


export const fetch_services = () => {
  return dispatch => {
    let services_promise = Parse.Cloud.run("fetch_homepage_services");
    services_promise.then(
      response => {
        const convertedResponse = fetch_helpers.normalizeParseResponseData(response);

        const activities = convertedResponse.activities;
        const serialized_activities = fetch_helpers.mapServiceObjects(activities);

        const places = convertedResponse.places;
        const serialized_places = fetch_helpers.mapServiceObjects(places);

        const foods = convertedResponse.foods;
        const serialized_foods = fetch_helpers.mapServiceObjects(foods);

        dispatch(services_fetched({ services: convertedResponse }));
        dispatch(retrieve_popular_tags({ services: convertedResponse }));
        dispatch(retrieve_popular_places(serialized_places));
        dispatch(retrieve_exciting_activities(serialized_activities));
        dispatch(retrieve_delicious_food(serialized_foods));
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
    query.limit(16);
    query.find().then(
      response => {
        const convertedResponse = fetch_helpers.normalizeParseResponseData(response);
        const responseWithPlaceholderImage = fetch_helpers.mapServiceObjects(convertedResponse)
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
    service.tags.forEach(tag => {
      tags.push(tag.label);
    })
  });
  if (!services_with_tags.length) {
    return [];
  }
  let flatten_tags = tags;//.reduce((flatten, arr) => [...flatten, ...arr]);
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
  //return tags_ordered_by_count
  let tags_ordered_by_popularity = tags_ordered_by_count.map(tag => {
    let randBg = fetch_helpers.bgColors[Math.floor(Math.random() * fetch_helpers.bgColors.length)];
    let randHoverBg =
      fetch_helpers.hoverBgColors[Math.floor(Math.random() * fetch_helpers.hoverBgColors.length)];
    return { label: tag.tag, background: randBg, hoverBg: randHoverBg };
  });
  // Ugly code to retrive popular tags but we might refactor tags data model in near future
  return tags_ordered_by_popularity;
};
