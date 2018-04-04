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
      let selected_tags_array = current_search_query.tags.splice(",");
      let tags_str = "";
      if (selected_tags_array.includes(item_tag)) {
        let new_arr = selected_tags_array.filter(tag => tag !== item_tag);
        selected_tags_array = new_arr;
        tags_str = new_arr.join(",");
      } else {
        selected_tags_array.push(item_tag);
        tags_str = selected_tags_array.join(",");
      }
      search_params.tags = selected_tags_array;
    }
    dispatch(update_path(search_params));
    // will trigger update_search_query from results_container
  };
};

export const update_path = search_params => {
  return dispatch => {
    let results_path = "/results";
    let tags = "";
    if (search_params.type === "") {
      if (search_params.tags.length) {
        tags = search_params.tags.join(",");
        results_path = results_path + "?tags=" + tags;
      } else {
        console.log("no type and no tags");
      }
    } else {
      results_path = results_path + "?type=" + search_params.type;
      if (search_params.tags.length) {
        tags = search_params.tags.join(",");
        results_path = results_path + "&tags=" + tags;
      } else {
        console.log("no type and no tags");
      }
    }
    history.push(results_path);
    // will trigger update_search_query from results_container
  };
};

/* called from componentWillUpdate of results_container */
/* is triggered whenever type or tags props have changed */
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
