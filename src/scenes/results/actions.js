import Parse from "parse";
import history from "./../../main/history";

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

export const toggle_tag_from_search_query = (
  current_search_query,
  item_tag
) => {
  return dispatch => {
    let search_params = current_search_query;
    if (current_search_query.tags.length) {
      // if tags present in url
      let selected_tags_array = current_search_query.tags.splice(",");
      let tags_str = "";
      if (selected_tags_array.includes(item_tag)) {
        // if tag already present, remove it
        let new_arr = selected_tags_array.filter(tag => tag !== item_tag);
        selected_tags_array = new_arr;
        tags_str = new_arr.join(",");
      } else {
        // if tag was not present, add it
        selected_tags_array.push(item_tag);
        tags_str = selected_tags_array.join(",");
      }
      search_params.tags = selected_tags_array;
    } else {
      // If No tags yet
      if (item_tag) {
        search_params.tags.push(item_tag);
      }
    }
    dispatch(update_path(search_params));
    // will trigger update_search_query from results_container
  };
};

export const update_path = search_params => {
  return dispatch => {
    let results_path = "/results";
    let tags = "";
    if (!search_params.type.length) {
      if (search_params.tags.length) {
        tags = search_params.tags.join(",");
        results_path = results_path + "?tags=" + tags;
      } else {
        console.log("no service_types and no tags");
      }
    } else {
      results_path = results_path + "?service_types=" + search_params.type;
      if (search_params.tags.length) {
        tags = search_params.tags.join(",");
        results_path = results_path + "&tags=" + tags;
      } else {
        console.log("no service_types and no tags");
      }
    }
    history.push(results_path);
    // will trigger update_search_query from results_container
  };
};

/* called from componentWillUpdate of results_container */
/* is triggered whenever service_types or tags props have changed */
export const update_search_query = search_params => {
  return dispatch => {
    dispatch(search_query_updated({ search_query: search_params }));
    dispatch(fetch_results(search_params));
  };
};

const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

//const service_types_list = ["activity", "food", "place"];
export const fetch_results = search_query => {
  return dispatch => {
    let query = undefined;

    let tags = search_query.tags;
    let service_types = search_query.type;

    if (service_types.length && !service_types.includes("trip")) {
      // service_types specified but none of them is of type trip
      let Service = Parse.Object.extend("Service");
      query = new Parse.Query(Service);
      query.containedIn("type", service_types);
      if (tags.length) {
        query.containsAll("tags", tags);
      }
      query = query.find();
    } else if (service_types.length && service_types.includes("trip")) {
      // service_types specified and one of them is of type trip
      let services_query = undefined;

      if (service_types.length === 1) {
        // only one service of type trip
        let Trip = Parse.Object.extend("Trip");
        let trip_query = new Parse.Query(Trip);
        if (tags.length) {
          trip_query.containsAll("tags", tags);
        } else {
          trip_query.limit(20);
        }
        services_query = trip_query;
      } else {
        // One service of type trip + at least one service of the 3 types
        let Service = Parse.Object.extend("Service");
        let type_service_query = new Parse.Query(Service);
        type_service_query.containedIn("type", service_types);

        if (tags.length) {
          let Service = Parse.Object.extend("Service");
          let tags_service_query = new Parse.Query(Service);
          tags_service_query.containsAll("tags", tags);
          services_query = Parse.Query.and(
            type_service_query,
            tags_service_query
          );
        } else {
          services_query = type_service_query;
        }
      }

      let service_arr = [];
      services_query.find().then(
        response => {
          const convertedResponse = normalizeParseResponseData(response);
          const responseWithPlaceholderImage = mapServiceObjects(
            convertedResponse
          );
          service_arr.push(responseWithPlaceholderImage);

          let Trip = Parse.Object.extend("Trip");
          let trip_query = new Parse.Query(Trip);
          if (tags.length) {
            trip_query.containsAll("tags", tags);
          }
          trip_query.find().then(
            response => {
              const convertedResponse = normalizeParseResponseData(response);
              const responseWithPlaceholderImage = mapServiceObjects(
                convertedResponse
              );
              service_arr.push(responseWithPlaceholderImage);
              let flattened_service_arr = service_arr.reduce(
                (acc, val) => acc.concat(val),
                []
              );
              let uniq_services = removeDuplicates(
                flattened_service_arr,
                "createdAt"
              );
              dispatch(results_fetched({ results: uniq_services }));
              return;
            },
            error => {
              // TODO dispatch the error to error handler and retry the request
              console.log(error);
            }
          );
        },
        error => {
          // TODO dispatch the error to error handler and retry the request
          console.log(error);
        }
      );
    } else if (!service_types.length && tags.length) {
      // No service_types specified and only tags
      query = Parse.Cloud.run("fetch_services_from_tags", { tags: tags });
    }

    if (!(service_types.length && service_types.includes("trip"))) {
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
    }
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
